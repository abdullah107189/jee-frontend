"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Camera, RefreshCw, AlertCircle, CheckCircle2, Upload, Sparkles } from "lucide-react";

interface QrCameraScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanSuccess: (decodedSerial: string) => void;
  title?: string;
  continuous?: boolean;
  scannedCount?: number;
}

function playScanBeep() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // browser audio policies ignore
  }
}

export function QrCameraScanner({
  open,
  onOpenChange,
  onScanSuccess,
  title = "Scan QR Code / Barcode",
  continuous = false,
  scannedCount = 0,
}: QrCameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isInsecureHttp, setIsInsecureHttp] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [recentScanned, setRecentScanned] = useState<string | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastScannedRef = useRef<{ serial: string; time: number } | null>(null);

  /**
   * Helper to parse serial number from scanned text
   * If URL like https://jee.store/warranty?serial=JEE-FAN-001 -> returns JEE-FAN-001
   */
  const parseSerialFromText = (raw: string): string => {
    const trimmed = raw.trim();
    try {
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        const url = new URL(trimmed);
        const serialParam = url.searchParams.get("serial");
        if (serialParam) return serialParam.trim().toUpperCase();
      }
    } catch {
      // not a valid URL, fallback to raw string
    }
    return trimmed.toUpperCase();
  };

  // Check Secure Context on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isSecure = window.isSecureContext || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      setIsInsecureHttp(!isSecure);
    }
  }, []);

  // Start Camera
  const startCamera = async () => {
    try {
      setErrorMsg(null);
      setScannedResult(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const isHttp = typeof window !== "undefined" && window.location.protocol === "http:" && window.location.hostname !== "localhost";
        if (isHttp) {
          setErrorMsg("Mobile browsers block live video on HTTP (requires HTTPS). Use the Photo Camera button below to snap QR directly!");
        } else {
          setErrorMsg("Camera access is not supported by your browser/device.");
        }
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setIsScanning(true);
      }
    } catch (err: any) {
      console.error("[CAMERA_START_ERROR]", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMsg("Camera permission was denied. Please allow camera access in browser settings.");
      } else {
        setErrorMsg("Could not connect to camera: " + (err.message || "Unknown error"));
      }
    }
  };

  // Stop Camera
  const stopCamera = () => {
    setIsScanning(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [open]);

  // Frame scanner loop using Native BarcodeDetector with jsQR fallback
  useEffect(() => {
    if (!isScanning || !videoRef.current) return;

    let isSubscribed = true;

    // Check if BarcodeDetector API exists in browser
    const BarcodeDetectorClass = (window as any).BarcodeDetector;
    let detector: any = null;

    if (BarcodeDetectorClass) {
      try {
        detector = new BarcodeDetectorClass({
          formats: ["qr_code", "code_128", "ean_13", "code_39"],
        });
      } catch (e) {
        console.warn("BarcodeDetector initialization failed, fallback to jsQR", e);
      }
    }

    // Offscreen canvas for jsQR fallback
    const offscreenCanvas = document.createElement("canvas");
    const offscreenCtx = offscreenCanvas.getContext("2d", { willReadFrequently: true });

    const handleDetected = (rawCode: string) => {
      const cleanSerial = parseSerialFromText(rawCode);
      const now = Date.now();
      if (
        lastScannedRef.current &&
        lastScannedRef.current.serial === cleanSerial &&
        now - lastScannedRef.current.time < 2200
      ) {
        return false;
      }
      lastScannedRef.current = { serial: cleanSerial, time: now };
      playScanBeep();

      if (continuous) {
        setRecentScanned(cleanSerial);
        setTimeout(() => setRecentScanned(null), 1800);
        onScanSuccess(cleanSerial);
        return false; // keep scanning
      } else {
        setScannedResult(cleanSerial);
        stopCamera();
        onScanSuccess(cleanSerial);
        onOpenChange(false);
        return true; // stop
      }
    };

    const scanFrame = async () => {
      if (!isSubscribed || !videoRef.current || !isScanning) return;

      const video = videoRef.current;
      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        // Try native BarcodeDetector first
        if (detector) {
          try {
            const barcodes = await detector.detect(video);
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              const shouldStop = handleDetected(barcodes[0].rawValue);
              if (shouldStop) return;
            }
          } catch {
            // ignore detector error on empty frame
          }
        }

        // Fallback to jsQR
        if (offscreenCtx) {
          try {
            offscreenCanvas.width = video.videoWidth;
            offscreenCanvas.height = video.videoHeight;
            offscreenCtx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const imgData = offscreenCtx.getImageData(0, 0, video.videoWidth, video.videoHeight);
            const qrCode = jsQR(imgData.data, imgData.width, imgData.height, {
              inversionAttempts: "dontInvert",
            });
            if (qrCode && qrCode.data) {
              const shouldStop = handleDetected(qrCode.data);
              if (shouldStop) return;
            }
          } catch {
            // frame capture skipped
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(scanFrame);
    };

    animationFrameRef.current = requestAnimationFrame(scanFrame);

    return () => {
      isSubscribed = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isScanning]);

  /**
   * Handle Photo Capture / Image Upload Fallback
   * Works on ALL browsers and HTTP local network without requiring HTTPS!
   */
  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImage(true);
    setErrorMsg(null);

    try {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = () => {
        img.onload = async () => {
          try {
            // 1. Try BarcodeDetector first if available
            const BarcodeDetectorClass = (window as any).BarcodeDetector;
            if (BarcodeDetectorClass) {
              try {
                const detector = new BarcodeDetectorClass({
                  formats: ["qr_code", "code_128", "ean_13", "code_39"],
                });
                const barcodes = await detector.detect(img);
                if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
                  const cleanSerial = parseSerialFromText(barcodes[0].rawValue);
                  setScannedResult(cleanSerial);
                  stopCamera();
                  onScanSuccess(cleanSerial);
                  onOpenChange(false);
                  setIsProcessingImage(false);
                  return;
                }
              } catch {
                // fall through to jsQR
              }
            }

            // 2. Decode with jsQR on canvas
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            canvas.width = img.width;
            canvas.height = img.height;
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const code = jsQR(imgData.data, imgData.width, imgData.height, {
                inversionAttempts: "attemptBoth",
              });
              if (code && code.data) {
                const cleanSerial = parseSerialFromText(code.data);
                setScannedResult(cleanSerial);
                stopCamera();
                onScanSuccess(cleanSerial);
                onOpenChange(false);
                setIsProcessingImage(false);
                return;
              }
            }

            setErrorMsg("No QR code found in photo. Please ensure good lighting and focus on the QR code.");
            setIsProcessingImage(false);
          } catch (err: any) {
            setErrorMsg("Failed to read image: " + (err.message || "Unknown error"));
            setIsProcessingImage(false);
          }
        };
        img.src = reader.result as string;
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setErrorMsg("Failed to process photo: " + (err.message || "Unknown error"));
      setIsProcessingImage(false);
    }
  };

  const handleClose = () => {
    stopCamera();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 overflow-hidden">
        <DialogHeader className="p-0 mb-3 flex flex-row items-center justify-between">
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary" />
            {title}
          </DialogTitle>
          {continuous && (
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
              ⚡ Scanned: {scannedCount}
            </span>
          )}
        </DialogHeader>

        {/* Video Viewport / Viewfinder */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-border shadow-inner">
          <video
            ref={videoRef}
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Scanner Viewfinder Overlay */}
          {isScanning && !errorMsg && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 border-2 border-primary/70 rounded-2xl">
                {/* Corner Markers */}
                <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-primary rounded-tl-md" />
                <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-primary rounded-tr-md" />
                <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-primary rounded-bl-md" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-primary rounded-br-md" />

                {/* Animated Scan Line */}
                <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Error Message & Photo Capture Fallback */}
          {errorMsg && (
            <div className="absolute inset-0 p-5 bg-background/95 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
              <p className="text-xs font-bold text-foreground mb-1">
                {isInsecureHttp ? "HTTP Camera Policy" : "Camera Access Notice"}
              </p>
              <p className="text-[11px] text-muted-foreground max-w-xs mb-3 leading-relaxed">
                {errorMsg}
              </p>

              <div className="flex flex-col gap-2 w-full max-w-xs">
                <Button
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20"
                >
                  <Camera className="h-4 w-4" />
                  <span>Snap Photo with Camera</span>
                </Button>

                {!isInsecureHttp && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={startCamera}
                    className="gap-1.5 text-xs rounded-xl"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Retry Live Camera
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Continuous Scan Beep Flash Banner */}
          {recentScanned && (
            <div className="absolute top-3 left-3 right-3 bg-emerald-600/95 text-white py-2 px-3 rounded-xl shadow-lg backdrop-blur-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200 z-20">
              <div className="flex items-center gap-2 font-mono font-bold text-xs truncate">
                <CheckCircle2 className="h-4 w-4 text-emerald-200 shrink-0" />
                <span className="truncate">Added #{scannedCount}: {recentScanned}</span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded text-white shrink-0">
                BEEP!
              </span>
            </div>
          )}

          {/* Success Overlay for Single Scan */}
          {!continuous && scannedResult && (
            <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-2" />
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Scanned Successfully!
              </p>
              <p className="text-base font-mono font-bold text-emerald-300 mt-1">
                {scannedResult}
              </p>
            </div>
          )}

          {/* Processing Photo Overlay */}
          {isProcessingImage && (
            <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center text-center p-4">
              <Sparkles className="h-8 w-8 text-primary animate-spin mb-2" />
              <p className="text-xs font-bold text-foreground">Reading QR Code...</p>
            </div>
          )}
        </div>

        {/* Hidden Camera Capture / File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageFile}
          className="hidden"
        />

        {/* Alternative Photo Capture Option even when video is active */}
        {!errorMsg && (
          <div className="flex justify-center mt-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Take photo or upload image</span>
            </button>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground text-center mt-2">
          {continuous
            ? "Keep pointing at QR codes on each box to scan continuously. An audio beep confirms each unit."
            : "Point camera at the QR code on the product box, or tap take photo to snap it."}
        </p>

        <DialogFooter className="p-0 mt-3 flex flex-row gap-2">
          {continuous ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 rounded-xl text-xs font-semibold h-10"
              >
                Close
              </Button>
              <Button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-xl text-xs font-bold h-10 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
              >
                Done ({scannedCount} Items)
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="w-full rounded-xl text-xs font-semibold h-9"
            >
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
