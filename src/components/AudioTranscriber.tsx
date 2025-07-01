import React, { useState, useCallback } from "react";
import {
  Upload,
  FileAudio,
  Download,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { config } from "../lib/config";

interface TranscriptionResult {
  filename: string;
  transcription: string;
  word_count: number;
  character_count: number;
}

const AudioTranscriber: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<"text" | "docx">("text");
  const [dragActive, setDragActive] = useState(false);
  const [serverStatus, setServerStatus] = useState<string>("unknown");
  const [language, setLanguage] = useState<string>("auto");
  const [task, setTask] = useState<"transcribe" | "translate">("transcribe");
  const [timeoutMinutes, setTimeoutMinutes] = useState<number>(10);

  const supportedFormats = [
    ".mp3",
    ".wav",
    ".m4a",
    ".flac",
    ".ogg",
    ".wma",
    ".aac",
    ".mpeg",
    ".mpg",
    ".mp4",
  ];

  const languages = [
    { code: "auto", name: "Auto-detect" },
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
    { code: "tr", name: "Turkish" },
    { code: "pl", name: "Polish" },
    { code: "nl", name: "Dutch" },
    { code: "sv", name: "Swedish" },
    { code: "id", name: "Indonesian" },
    { code: "th", name: "Thai" },
    { code: "vi", name: "Vietnamese" },
    { code: "ms", name: "Malay" },
    { code: "tl", name: "Filipino/Tagalog" },
    { code: "bn", name: "Bengali" },
    { code: "ur", name: "Urdu" },
    { code: "fa", name: "Persian/Farsi" },
    { code: "he", name: "Hebrew" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "ml", name: "Malayalam" },
    { code: "kn", name: "Kannada" },
    { code: "gu", name: "Gujarati" },
    { code: "pa", name: "Punjabi" },
    { code: "mr", name: "Marathi" },
    { code: "ne", name: "Nepali" },
    { code: "si", name: "Sinhala" },
    { code: "my", name: "Myanmar/Burmese" },
    { code: "km", name: "Khmer/Cambodian" },
    { code: "lo", name: "Lao" },
    { code: "ka", name: "Georgian" },
    { code: "am", name: "Amharic" },
    { code: "sw", name: "Swahili" },
    { code: "yo", name: "Yoruba" },
    { code: "ig", name: "Igbo" },
    { code: "ha", name: "Hausa" },
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const droppedFile = e.dataTransfer.files[0];
      const fileName = droppedFile?.name?.toLowerCase() || "";
      const fileExt = fileName.substring(fileName.lastIndexOf("."));

      // Check if it's a supported audio format by extension or MIME type
      const isAudioByMime =
        droppedFile?.type?.startsWith("audio/") ||
        droppedFile?.type?.includes("mpeg");
      const isAudioByExt = supportedFormats.some((format) =>
        fileName.endsWith(format)
      );

      if (droppedFile && (isAudioByMime || isAudioByExt)) {
        setFile(droppedFile);
        setError(null);
        setResult(null);
        console.log("File accepted:", {
          name: droppedFile.name,
          type: droppedFile.type,
          size: droppedFile.size,
          extension: fileExt,
        });
      } else {
        console.log("File rejected:", {
          name: droppedFile?.name,
          type: droppedFile?.type,
          extension: fileExt,
          isAudioByMime,
          isAudioByExt,
        });
        setError(
          `Please select a valid audio file. Supported formats: ${supportedFormats.join(
            ", "
          )}`
        );
      }
    },
    [supportedFormats]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileName = selectedFile.name.toLowerCase();
      const fileExt = fileName.substring(fileName.lastIndexOf("."));

      // Check if it's a supported audio format by extension or MIME type
      const isAudioByMime =
        selectedFile.type.startsWith("audio/") ||
        selectedFile.type.includes("mpeg");
      const isAudioByExt = supportedFormats.some((format) =>
        fileName.endsWith(format)
      );

      if (isAudioByMime || isAudioByExt) {
        setFile(selectedFile);
        setError(null);
        setResult(null);
        console.log("File selected:", {
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          extension: fileExt,
        });
      } else {
        console.log("File rejected:", {
          name: selectedFile.name,
          type: selectedFile.type,
          extension: fileExt,
          isAudioByMime,
          isAudioByExt,
        });
        setError(
          `Please select a valid audio file. Supported formats: ${supportedFormats.join(
            ", "
          )}`
        );
      }
    }
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    // Return interval ID so we can clear it if needed
    return interval;
  };

  const transcribeAudio = async () => {
    if (!file) return;

    setIsLoading(true);
    setProgress(0);
    setError(null);
    setResult(null);

    // Start progress simulation
    simulateProgress();

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("output_format", outputFormat);
      formData.append("language", language);
      formData.append("task", task);
      formData.append("timeout_minutes", timeoutMinutes.toString());

      const response = await fetch(config.API_TRANSCRIBE_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        // Handle specific timeout error from backend
        if (response.status === 408) {
          throw new Error(
            errorData?.detail ||
              `Request timed out after ${timeoutMinutes} minutes. Please try with a shorter audio file or increase the timeout.`
          );
        }

        throw new Error(
          errorData?.detail || `HTTP error! status: ${response.status}`
        );
      }

      if (outputFormat === "docx") {
        // Handle DOCX download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `${file.name.split(".")[0]}_transcription.docx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Set a success result for UI feedback
        setResult({
          filename: file.name,
          transcription: "DOCX file downloaded successfully.",
          word_count: 0,
          character_count: 0,
        });
      } else {
        // Handle JSON response
        const data = await response.json();
        setResult(data);
      }

      setProgress(100);
    } catch (error) {
      console.error("Transcription error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTranscription = () => {
    if (!result) return;

    const element = document.createElement("a");
    const file = new Blob([result.transcription], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${result.filename.split(".")[0]}_transcription.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const testConnection = async () => {
    try {
      const response = await fetch(config.API_ROOT_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setServerStatus(`✅ Connected - ${data.mode} mode (${data.model})`);
      } else {
        setServerStatus("❌ Connection failed");
      }
    } catch (error) {
      console.error("Connection test failed:", error);
      setServerStatus("❌ Connection failed");
    }
  };

  // Test connection on component mount
  React.useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Audio to Text Transcriber
          </CardTitle>
          <CardDescription className="text-lg">
            Upload your audio file and get accurate text transcription
          </CardDescription>
          <div className="mt-4 p-2 bg-muted rounded-md">
            <span className="text-sm font-medium">Server Status: </span>
            <span className="text-sm">{serverStatus}</span>
            {serverStatus.includes("❌") && (
              <button
                onClick={testConnection}
                className="ml-2 text-xs text-primary hover:underline"
              >
                Retry
              </button>
            )}
          </div>

          {/* Accuracy Tips */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              💡 Tips for Better Accuracy:
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Use high-quality audio with minimal background noise</li>
              <li>
                • Select the correct language (Indonesian, English, etc.) for
                best results
              </li>
              <li>
                • Auto-detect works well but manual selection is more accurate
              </li>
              <li>
                • Use "Translate" to convert any language audio to English text
              </li>
              <li>
                • WAV/FLAC formats often give better results than compressed
                formats
              </li>
              <li>
                • Shorter segments (under 30 minutes) typically transcribe more
                accurately
              </li>
              <li>
                • Processing timeout is handled server-side for reliability
              </li>
            </ul>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${
                dragActive
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground/25"
              }
              ${!isLoading ? "hover:border-primary hover:bg-primary/5" : ""}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FileAudio className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                Drop your audio file here, or{" "}
                <label
                  htmlFor="file-upload"
                  className="text-primary cursor-pointer hover:underline"
                >
                  browse
                </label>
              </p>
              <p className="text-sm text-muted-foreground">
                Supported formats: {supportedFormats.join(", ")}
              </p>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept="audio/*,video/mp4,video/mpeg,.mp3,.wav,.m4a,.flac,.ogg,.wma,.aac,.mpeg,.mpg,.mp4"
                onChange={handleFileSelect}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Selected File Info */}
          {file && (
            <Card className="bg-muted/50">
              <CardContent className="flex items-center space-x-4 pt-6">
                <FileAudio className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Output Format Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Output Format</label>
            <Select
              value={outputFormat}
              onValueChange={(value: "text" | "docx") => setOutputFormat(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text (JSON Response)</SelectItem>
                <SelectItem value="docx">Word Document (.docx)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Language</label>
            <Select
              value={language}
              onValueChange={(value: string) => setLanguage(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Task</label>
            <Select
              value={task}
              onValueChange={(value: "transcribe" | "translate") =>
                setTask(value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transcribe">Transcribe</SelectItem>
                <SelectItem value="translate">Translate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timeout Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Processing Timeout (Backend)
            </label>
            <Select
              value={timeoutMinutes.toString()}
              onValueChange={(value: string) =>
                setTimeoutMinutes(parseInt(value))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="10">10 minutes (recommended)</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="20">20 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes (max)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Server will stop processing after this time limit. Choose longer
              timeouts for large audio files.
            </p>
          </div>

          {/* Transcribe Button */}
          <Button
            onClick={transcribeAudio}
            disabled={!file || isLoading}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Transcribing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Start Transcription
              </>
            )}
          </Button>

          {/* Progress Bar */}
          {isLoading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  {progress < 90
                    ? "Processing audio..."
                    : progress === 90
                    ? "Transcribing with Whisper model..."
                    : "Finalizing..."}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              {progress === 90 && (
                <div className="text-xs text-muted-foreground text-center">
                  This may take a moment depending on audio length...
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="flex items-center space-x-2 pt-6">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-destructive">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Transcription Complete</span>
                </CardTitle>
                <CardDescription>File: {result.filename}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {outputFormat === "text" && result.word_count > 0 && (
                  <>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Word Count:</span>{" "}
                        {result.word_count}
                      </div>
                      <div>
                        <span className="font-medium">Character Count:</span>{" "}
                        {result.character_count}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Transcription:
                      </label>
                      <div className="p-4 bg-background border rounded-md max-h-40 overflow-y-auto">
                        <p className="text-sm leading-relaxed">
                          {result.transcription}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={downloadTranscription}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download as Text File
                    </Button>
                  </>
                )}
                {outputFormat === "docx" && (
                  <div className="text-center py-4">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-2" />
                    <p className="text-lg font-medium">
                      Document Downloaded Successfully!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Check your downloads folder for the transcribed document.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioTranscriber;
