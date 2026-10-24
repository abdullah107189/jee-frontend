"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Camera, X, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

interface QrCameraScannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScanSuccess: (decodedSerial: string) => void;
  title?: string;
}

export function QrCameraScanner({
  open,
  onOpenChange,
  onScanSuccess,
  title = "Scan QR Code / Barcode",
}: QrCameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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

  // Start Camera
  const startCamera = async () => {
    try {
      setErrorMsg(null);
      setScannedResult(null);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setErrorMsg("Camera access is not supported by your browser/device.");
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

  // Frame scanner loop using Native BarcodeDetector if available
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
        console.warn("BarcodeDetector initialization failed, fallback to manual capture", e);
      }
    }

    const scanFrame = async () => {
      if (!isSubscribed || !videoRef.current || !isScanning) return;

      if (detector && videoRef.current.readyState >= 2) {
        try {
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes && barcodes.length > 0) {
            const rawValue = barcodes[0].rawValue;
            if (rawValue) {
              const cleanSerial = parseSerialFromText(rawValue);
              setScannedResult(cleanSerial);
              stopCamera();
              onScanSuccess(cleanSerial);
              onOpenChange(false);
              return;
            }
          }
        } catch {
          // ignore detector error on empty frame
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

          {/* Error Message if camera failed */}
          {errorMsg && (
            <div className="absolute inset-0 p-5 bg-background/95 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-8 w-8 text-destructive mb-2" />
              <p className="text-xs font-semibold text-foreground mb-1">
                Camera Access Error
              </p>
              <p className="text-[11px] text-muted-foreground max-w-xs mb-4">
                {errorMsg}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={startCamera}
                className="gap-1.5 text-xs rounded-xl"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry Camera
              </Button>
            </div>
          )}

          {/* Success Overlay */}
          {scannedResult && (
            <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-2" />
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Scanned Successfully!
              </p>
              <p className="text-base font-mono font-bold text-emerald-300 mt-1">
                {scannedResult}
              </p>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-3">
          Point your camera at the QR code or Barcode printed on the product box.
        </p>

        <DialogFooter className="p-0 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="w-full rounded-xl"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
