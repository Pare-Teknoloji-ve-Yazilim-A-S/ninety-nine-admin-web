'use client'
import { forwardRef, InputHTMLAttributes, useState, useRef } from 'react'
import { Upload, X, File } from 'lucide-react'

interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string
    error?: string
    helperText?: string
    isRequired?: boolean
    acceptedTypes?: string[]
    maxSize?: number // in MB
    showPreview?: boolean
    multiple?: boolean
    onFilesChange?: (files: FileList | null) => void
    selectedFiles?: File[] // Controlled state from parent
    onFileRemove?: (index: number) => void // Callback for removing files
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
    ({
        label,
        error,
        helperText,
        isRequired = false,
        acceptedTypes = [],
        maxSize = 5,
        showPreview = true,
        multiple = false,
        onFilesChange,
        selectedFiles = [], // Use prop or default to empty array
        onFileRemove,
        className = '',
        ...props
    }, ref) => {
        const [dragActive, setDragActive] = useState(false)
        const inputRef = useRef<HTMLInputElement>(null)

        const handleDrag = (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            if (e.type === 'dragenter' || e.type === 'dragover') {
                setDragActive(true)
            } else if (e.type === 'dragleave') {
                setDragActive(false)
            }
        }

        const handleDrop = (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setDragActive(false)

            const files = e.dataTransfer.files
            handleFiles(files)
        }

        const handleFiles = (files: FileList | null) => {
            if (!files) return

            const fileArray = Array.from(files)
            const validFiles = fileArray.filter(file => {
                // Check file type
                if (acceptedTypes.length > 0) {
                    const fileType = file.type.toLowerCase()
                    const isValidType = acceptedTypes.some(type =>
                        fileType.includes(type.toLowerCase()) ||
                        file.name.toLowerCase().endsWith(type.toLowerCase())
                    )
                    if (!isValidType) return false
                }

                // Check file size
                if (file.size > maxSize * 1024 * 1024) return false

                return true
            })

            // Use callback to let parent handle file state
            onFilesChange?.(files)
        }

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            handleFiles(e.target.files)
        }

        const removeFile = (index: number) => {
            onFileRemove?.(index)
        }

        const formatFileSize = (bytes: number) => {
            if (bytes === 0) return '0 Bytes'
            const k = 1024
            const sizes = ['Bytes', 'KB', 'MB', 'GB']
            const i = Math.floor(Math.log(bytes) / Math.log(k))
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
        }

        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-text-primary font-inter">
                        {label}
                        {isRequired && <span className="text-primary-red ml-1">*</span>}
                    </label>
                )}

                <div
                    className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${dragActive ? 'border-primary-gold bg-primary-gold/10' : 'border-primary-gold/30 hover:border-primary-gold/50'}
            ${error ? 'border-primary-red' : ''}
            bg-background-secondary
            ${className}
          `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        multiple={multiple}
                        accept={acceptedTypes.join(',')}
                        onChange={handleInputChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        {...props}
                    />

                    <div className="space-y-2">
                        <Upload className="mx-auto h-12 w-12 text-text-secondary" />
                        <div className="text-sm text-text-primary font-inter">
                            <span className="font-medium">Dosya yüklemek için tıklayın</span>
                            <span className="text-text-secondary"> veya sürükleyip bırakın</span>
                        </div>
                        <p className="text-xs text-text-secondary font-inter">
                            {acceptedTypes.length > 0 && `Desteklenen formatlar: ${acceptedTypes.join(', ')}`}
                            {maxSize && ` • Maksimum boyut: ${maxSize}MB`}
                        </p>
                    </div>
                </div>

                {/* Preview */}
                {showPreview && selectedFiles.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-text-primary font-inter">Seçilen dosyalar:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {selectedFiles.map((file, index) => {
                                const isImage = file.type.startsWith('image/');
                                const imageUrl = isImage ? URL.createObjectURL(file) : null;
                                
                                return (
                                    <div key={index} className="relative bg-background-card rounded-lg border border-primary-gold/20 overflow-hidden">
                                        {/* Image Preview */}
                                        {isImage && imageUrl ? (
                                            <div className="aspect-video bg-gray-100 relative">
                                                <img
                                                    src={imageUrl}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover"
                                                    onLoad={() => URL.revokeObjectURL(imageUrl)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="absolute top-2 right-2 bg-primary-red text-white rounded-full p-1 hover:bg-primary-red/80 transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                                <File className="h-8 w-8 text-text-secondary" />
                                            </div>
                                        )}
                                        
                                        {/* File Info */}
                                        <div className="p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-text-primary font-inter truncate" title={file.name}>
                                                        {file.name}
                                                    </p>
                                                    <p className="text-xs text-text-secondary font-inter">
                                                        {formatFileSize(file.size)}
                                                    </p>
                                                </div>
                                                {!isImage && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(index)}
                                                        className="ml-2 text-primary-red hover:text-primary-red/80 transition-colors"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {error && (
                    <p className="text-sm text-primary-red font-inter">{error}</p>
                )}

                {helperText && !error && (
                    <p className="text-sm text-text-secondary font-inter">{helperText}</p>
                )}
            </div>
        )
    }
)

FileUpload.displayName = 'FileUpload'

export default FileUpload 