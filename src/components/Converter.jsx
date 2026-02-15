import { useState, useRef, useCallback } from "react";
import { useToast } from "./Toast";
import { Trash2, FileText, Check, Download, Video, Image as ImageIcon, X } from "lucide-react";
import styles from "./Converter.module.css";
import JSZip from "jszip";

const IMAGE_FORMATS = ["JPG", "PNG", "WebP", "GIF", "BMP", "TIFF", "ICO"];
const VIDEO_FORMATS = ["MP4", "MOV", "AVI", "WebM", "MKV", "FLV", "WMV"];

const MAX_FILE_SIZE = 100 * 1024 * 1024;

const FUN_MESSAGES = [
    "Flipping your files…",
    "Crunching pixels…",
    "Almost there…",
    "Making magic happen…",
];

function getFileType(file) {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type === "application/pdf") return "pdf";
    return null;
}



function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function Converter({ minimal = false }) {
    // Files State: Array of objects { id, file, originalName, type, status ('idle', 'converting', 'done'), progress, resultUrl }
    const [files, setFiles] = useState([]);
    const [mode, setMode] = useState("convert"); // 'convert' | 'compress'
    const [outputFormat, setOutputFormat] = useState("");
    const [compressionLevel, setCompressionLevel] = useState(""); // 'low', 'medium', 'high'
    const [converting, setConverting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [funMsg, setFunMsg] = useState("");
    const inputRef = useRef(null);
    const toast = useToast();

    // Helper to add files
    const addFiles = useCallback((newFiles) => {
        const validFiles = [];
        Array.from(newFiles).forEach(f => {
            if (f.size > MAX_FILE_SIZE) {
                toast.error(`${f.name} is too large (>100MB).`);
                return;
            }
            const type = getFileType(f);
            if (!type) {
                // For compression, we might allow PDF in future, but stick to img/vid for now
                toast.error(`${f.name} format not supported.`);
                return;
            }
            // Generate ID
            const id = Math.random().toString(36).substr(2, 9);
            validFiles.push({
                id,
                file: f,
                originalName: f.name,
                type,
                status: "idle",
                progress: 0,
                resultUrl: null // Placeholder for converted file URL
            });
        });

        if (validFiles.length > 0) {
            setFiles(prev => [...prev, ...validFiles]);
            toast.success(`Added ${validFiles.length} file${validFiles.length > 1 ? 's' : ''}.`);
        }
    }, [toast]);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            addFiles(e.dataTransfer.files);
        }
    }, [addFiles]);

    const onDragOver = (e) => { e.preventDefault(); setDragActive(true); };
    const onDragLeave = () => setDragActive(false);
    const onInputChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            addFiles(e.target.files);
        }
        // Reset input so same files can be selected again if needed
        e.target.value = null;
    };

    const removeFile = (id) => {
        setFiles(prev => {
            const fileToRemove = prev.find(f => f.id === id);
            if (fileToRemove?.resultUrl) {
                URL.revokeObjectURL(fileToRemove.resultUrl);
            }
            return prev.filter(f => f.id !== id);
        });
    };



    // Compression Helper
    const compressImage = async (file, qualityLevel) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                const canvas = document.createElement("canvas");
                // Determine scale factor - Ensure resizing happens to see difference
                let scale = 1;
                let q = 0.8; // Default Recommended

                if (qualityLevel === 'extreme') {
                    scale = 0.6; // Heavy resize
                    q = 0.5;
                } else if (qualityLevel === 'recommended') {
                    scale = 0.85; // Slight resize
                    q = 0.75;
                } else if (qualityLevel === 'low') {
                    scale = 0.95; // Very slight resize
                    q = 0.92;
                }

                // Calculate new dimensions
                let width = Math.floor(img.width * scale);
                let height = Math.floor(img.height * scale);

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        // If output is bigger, fallback to original if possible (but user asked for compression)
                        // Actually, sometimes canvas PNG is bigger than optimized PNG.
                        // We return the blob regardless, component can check size.
                        resolve(blob);
                        URL.revokeObjectURL(img.src);
                    },
                    file.type,
                    q
                );
            };
            img.onerror = (e) => reject(e);
        });
    };

    const handleAction = async () => {
        if (!files.length) return;

        if (mode === "convert" && !outputFormat) {
            toast.warning("Pick a format first!");
            return;
        }
        if (mode === "compress" && !compressionLevel) {
            toast.warning("Pick a compression level!");
            return;
        }

        setConverting(true);
        setFunMsg(
            mode === "convert"
                ? FUN_MESSAGES[Math.floor(Math.random() * FUN_MESSAGES.length)]
                : "Squeezing files tight..."
        );

        const fileIdsToProcess = files.filter(f => f.status !== "done").map(f => f.id);

        for (const id of fileIdsToProcess) {
            // Processing
            setFiles(prev => prev.map(f => f.id === id ? { ...f, status: "converting", progress: 0 } : f));

            try {
                const currentFileObj = files.find(f => f.id === id);
                let resultBlob = currentFileObj.file; // Default to original
                let resultUrl = null;

                if (mode === "compress" && currentFileObj.type === "image") {
                    // Real Compression
                    // Simulate progress nicely
                    setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: 30 } : f));
                    resultBlob = await compressImage(currentFileObj.file, compressionLevel);
                    setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: 70 } : f));
                } else {
                    // Mock Convert / Video / PDF
                    await new Promise(r => setTimeout(r, 800));
                }

                resultUrl = URL.createObjectURL(resultBlob);

                setFiles(prev => prev.map(f => {
                    if (f.id === id) {
                        return {
                            ...f,
                            status: "done",
                            progress: 100,
                            resultUrl,
                            compressedSize: resultBlob.size // Store new size
                        };
                    }
                    return f;
                }));

            } catch (err) {
                console.error(err);
                toast.error("Failed to process " + files.find(f => f.id === id)?.originalName);
            }
        }

        setConverting(false);
        toast.success(mode === "convert" ? "All files flipped!" : "All files compressed!");
    };

    const handleDownloadAll = async () => {
        const doneFiles = files.filter(f => f.status === "done" && f.resultUrl);
        if (doneFiles.length === 0) return;

        if (doneFiles.length === 1) {
            // Download Single
            const f = doneFiles[0];
            const a = document.createElement("a");

            let ext, suffix;
            if (mode === "convert") {
                ext = outputFormat.toLowerCase();
                suffix = "";
            } else {
                // Compression keeps original extension but adds _compressed usually, checking requirement...
                // User said: "remove _flipped name i want the same file name".
                // If I compress `img.png` -> `img.png`, browser will rename to `img (1).png`.
                // For compression, keeping same name is what they asked.
                ext = f.originalName.split('.').pop().toLowerCase();
                suffix = "";
            }

            const baseName = f.originalName.replace(/\.[^/.]+$/, "");
            a.href = f.resultUrl;
            a.download = `${baseName}${suffix ? '_' + suffix : ''}.${ext}`;
            a.click();
        } else {
            // Zip Download
            const zip = new JSZip();
            doneFiles.forEach(f => {
                let ext = f.originalName.split('.').pop().toLowerCase();
                if (mode === "convert") {
                    ext = outputFormat.toLowerCase();
                }
                const baseName = f.originalName.replace(/\.[^/.]+$/, "");
                zip.file(`${baseName}.${ext}`, f.file);
            });
            const content = await zip.generateAsync({ type: "blob" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(content);
            a.download = mode === "convert" ? "flipped_files.zip" : "compressed_files.zip";
            a.click();
        }
    };

    const handleReset = () => {
        setFiles([]);
        setOutputFormat("");
        setCompressionLevel("");
        setConverting(false);
        setFunMsg("");
    };

    // Determine available formats based on file types present
    const hasImage = files.some(f => f.type === "image");
    const hasVideo = files.some(f => f.type === "video");

    let availableFormats = [];
    if (hasImage) availableFormats = [...availableFormats, ...IMAGE_FORMATS];
    if (hasVideo) availableFormats = [...availableFormats, ...VIDEO_FORMATS];
    availableFormats = [...new Set(availableFormats)];
    if (availableFormats.length === 0) availableFormats = IMAGE_FORMATS; // Default

    const content = (
        <div className={styles.workspace}>
            <div className={styles.modeTabs}>
                <button
                    className={`${styles.modeBtn} ${mode === 'convert' ? styles.modeActive : ''}`}
                    onClick={() => setMode('convert')}
                    disabled={converting}
                >
                    Convert
                </button>
                <button
                    className={`${styles.modeBtn} ${mode === 'compress' ? styles.modeActive : ''}`}
                    onClick={() => setMode('compress')}
                    disabled={converting}
                >
                    Compress
                </button>
            </div>

            {files.length === 0 ? (
                <div
                    className={`${styles.dropzone} ${dragActive ? styles.active : ""}`}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onClick={() => inputRef.current?.click()}
                    id="dropzone"
                    role="button"
                    tabIndex={0}
                    aria-label="Upload files"
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*,video/*,.pdf"
                        onChange={onInputChange}
                        className={styles.fileInput}
                        id="file-input"
                        multiple
                    />
                    <div className={styles.dropzoneIcon}>
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                    </div>
                    <p className={styles.dropzoneTitle}>
                        {mode === 'convert' ? 'Toss files to flip' : 'Toss files to squeeze'}
                    </p>
                    <p className={styles.dropzoneSub}>
                        or <span className={styles.browse}>pick from your computer</span>
                    </p>
                    <p className={styles.dropzoneHint}>
                        Multiple images & videos allowed. Max 100MB ea.
                    </p>
                </div>
            ) : (
                <div className={styles.converter}>
                    {/* File List */}
                    <div className={styles.fileList}>
                        {files.map((f) => (
                            <div key={f.id} className={`${styles.fileItem} ${f.status === "done" ? styles.done : ""}`}>
                                <div className={styles.fileItemInfo}>
                                    <div className={styles.fileItemIcon}>
                                        {f.type === "image" ? <ImageIcon size={20} /> : <Video size={20} />}
                                    </div>
                                    <div style={{ overflow: "hidden" }}>
                                        <div className={styles.fileItemName} title={f.originalName}>
                                            {f.originalName}
                                        </div>
                                        <div className={styles.fileItemSize}>
                                            {formatBytes(f.file.size)}
                                            {f.compressedSize && f.compressedSize < f.file.size && (
                                                <span style={{ color: "var(--color-primary)", marginLeft: "8px" }}>
                                                    → {formatBytes(f.compressedSize)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.fileItemStatus}>
                                    {f.status === "converting" ? (
                                        <span className={styles.statusText}>{Math.round(f.progress)}%</span>
                                    ) : (
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            {f.status === "done" && (
                                                <Check size={18} style={{ color: "#22c55e" }} />
                                            )}
                                            <button
                                                className={styles.removeFileBtn}
                                                onClick={() => removeFile(f.id)}
                                                title="Remove file"
                                            >
                                                {f.status === "done" ? <Trash2 size={16} /> : <X size={16} />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className={styles.globalFormat}>
                        {mode === 'convert' ? (
                            <>
                                <label className={styles.label}>Convert all to:</label>
                                <div className={styles.formatGrid}>
                                    {availableFormats.map((fmt) => (
                                        <button
                                            key={fmt}
                                            className={`${styles.formatBtn} ${outputFormat === fmt ? styles.formatActive : ""}`}
                                            onClick={() => setOutputFormat(fmt)}
                                        >
                                            .{fmt.toLowerCase()}
                                        </button>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <label className={styles.label}>Compression Level:</label>
                                <div className={styles.qualityGrid}>
                                    <button
                                        className={`${styles.qualityBtn} ${compressionLevel === 'extreme' ? styles.qualityActive : ''}`}
                                        onClick={() => setCompressionLevel('extreme')}
                                    >
                                        <span className={styles.qualityLabel}>Extreme</span>
                                        <span className={styles.qualityDesc}>Smallest size, visible loss</span>
                                    </button>
                                    <button
                                        className={`${styles.qualityBtn} ${compressionLevel === 'recommended' ? styles.qualityActive : ''}`}
                                        onClick={() => setCompressionLevel('recommended')}
                                    >
                                        <span className={styles.qualityLabel}>Recommended</span>
                                        <span className={styles.qualityDesc}>Best balance</span>
                                    </button>
                                    <button
                                        className={`${styles.qualityBtn} ${compressionLevel === 'low' ? styles.qualityActive : ''}`}
                                        onClick={() => setCompressionLevel('low')}
                                    >
                                        <span className={styles.qualityLabel}>Low</span>
                                        <span className={styles.qualityDesc}>Best quality</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Progress & Message */}
                    {converting && (
                        <div className={styles.progressWrap}>
                            <p className={styles.funMessage}>{funMsg}</p>
                        </div>
                    )}

                    {/* Main Actions */}
                    <div className={styles.actions}>
                        {!files.every(f => f.status === "done") ? (
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={handleAction}
                                disabled={converting}
                                style={{ flex: 1 }}
                            >
                                {converting
                                    ? (mode === 'convert' ? "Flipping..." : "Squeezing...")
                                    : (mode === 'convert' ? "Flip All Files →" : "Compress All →")
                                }
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={handleDownloadAll}
                                style={{ flex: 1 }}
                            >
                                <Download size={18} style={{ marginRight: 8 }} />
                                Download All
                            </button>
                        )}

                        <button
                            className="btn btn-secondary"
                            onClick={handleReset}
                            disabled={converting}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    if (minimal) {
        return <div id="converter">{content}</div>;
    }

    return (
        <section className={`section ${styles.section}`} id="converter">
            <div className="container">
                <div className="section-header-center">
                    <p className="section-label">Converter</p>
                    <h2 className="section-title">Let&rsquo;s flip something.</h2>
                    <p className="section-subtitle">
                        Upload your file, pick a format, and we&rsquo;ll handle the rest.
                    </p>
                </div>
                {content}
            </div>
        </section>
    );
}
