'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import FileUpload from './FileUpload';
import { FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { UploadState } from '@/hooks/useResidentDocuments';

interface DocumentUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadNationalId: (file: File) => Promise<void>;
    onUploadOwnership: (file: File) => Promise<void>;
    uploadStates: {
        nationalId: UploadState;
        ownership: UploadState;
    };
}

export default function DocumentUploadModal({
    isOpen,
    onClose,
    onUploadNationalId,
    onUploadOwnership,
    uploadStates
}: DocumentUploadModalProps) {
    const [nationalIdFiles, setNationalIdFiles] = useState<File[]>([]);
    const [ownershipFiles, setOwnershipFiles] = useState<File[]>([]);

    const handleNationalIdFilesChange = (files: FileList | null) => {
        if (files) {
            setNationalIdFiles(Array.from(files));
        }
    };

    const handleOwnershipFilesChange = (files: FileList | null) => {
        if (files) {
            setOwnershipFiles(Array.from(files));
        }
    };

    const handleNationalIdUpload = async () => {
        if (nationalIdFiles.length > 0) {
            await onUploadNationalId(nationalIdFiles[0]);
            setNationalIdFiles([]);
        }
    };

    const handleOwnershipUpload = async () => {
        if (ownershipFiles.length > 0) {
            await onUploadOwnership(ownershipFiles[0]);
            setOwnershipFiles([]);
        }
    };

    const handleClose = () => {
        setNationalIdFiles([]);
        setOwnershipFiles([]);
        onClose();
    };

    const getUploadStatus = (uploadState: UploadState) => {
        if (uploadState.uploading) {
            return { icon: Upload, color: 'text-primary-gold', text: `Yükleniyor... %${uploadState.progress}` };
        }
        if (uploadState.error) {
            return { icon: AlertCircle, color: 'text-primary-red', text: uploadState.error };
        }
        if (uploadState.progress === 100) {
            return { icon: CheckCircle, color: 'text-semantic-success-500', text: 'Başarıyla yüklendi' };
        }
        return null;
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Belge Yükle"
            icon={FileText}
            size="lg"
        >
            <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2">
                {/* National ID Document Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
                            Kimlik Belgesi
                        </h4>
                        {getUploadStatus(uploadStates.nationalId) && (
                            <div className="flex items-center gap-2">
                                {React.createElement(getUploadStatus(uploadStates.nationalId)!.icon, {
                                    className: `h-4 w-4 ${getUploadStatus(uploadStates.nationalId)!.color}`
                                })}
                                <span className={`text-sm ${getUploadStatus(uploadStates.nationalId)!.color}`}>
                                    {getUploadStatus(uploadStates.nationalId)!.text}
                                </span>
                            </div>
                        )}
                    </div>

                    <FileUpload
                        acceptedTypes={[
                            'image/jpeg', 'image/png', 'image/jpg', 'image/gif',
                            'application/pdf',
                            'application/msword',
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'application/vnd.ms-excel',
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            'text/plain'
                        ]}
                        maxSize={10}
                        multiple={false}
                        onFilesChange={handleNationalIdFilesChange}
                        selectedFiles={nationalIdFiles}
                        onFileRemove={(index) => {
                            setNationalIdFiles(prev => prev.filter((_, i) => i !== index));
                        }}
                        helperText="JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX, TXT • Max 10MB"
                        showPreview={true}
                    />

                    {nationalIdFiles.length > 0 && (
                        <div className="flex justify-end">
                            <Button
                                variant="primary"
                                onClick={handleNationalIdUpload}
                                disabled={uploadStates.nationalId.uploading}
                                isLoading={uploadStates.nationalId.uploading}
                                icon={Upload}
                            >
                                Kimlik Belgesini Yükle
                            </Button>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700"></div>

                {/* Ownership Document Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-text-on-light dark:text-text-on-dark">
                            Tapu / Mülkiyet Belgesi
                        </h4>
                        {getUploadStatus(uploadStates.ownership) && (
                            <div className="flex items-center gap-2">
                                {React.createElement(getUploadStatus(uploadStates.ownership)!.icon, {
                                    className: `h-4 w-4 ${getUploadStatus(uploadStates.ownership)!.color}`
                                })}
                                <span className={`text-sm ${getUploadStatus(uploadStates.ownership)!.color}`}>
                                    {getUploadStatus(uploadStates.ownership)!.text}
                                </span>
                            </div>
                        )}
                    </div>

                    <FileUpload
                        acceptedTypes={[
                            'image/jpeg', 'image/png', 'image/jpg', 'image/gif',
                            'application/pdf',
                            'application/msword',
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'application/vnd.ms-excel',
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            'text/plain'
                        ]}
                        maxSize={10}
                        multiple={false}
                        onFilesChange={handleOwnershipFilesChange}
                        selectedFiles={ownershipFiles}
                        onFileRemove={(index) => {
                            setOwnershipFiles(prev => prev.filter((_, i) => i !== index));
                        }}
                        helperText="JPEG, PNG, GIF, PDF, DOC, DOCX, XLS, XLSX, TXT • Max 10MB"
                        showPreview={true}
                    />

                    {ownershipFiles.length > 0 && (
                        <div className="flex justify-end">
                            <Button
                                variant="primary"
                                onClick={handleOwnershipUpload}
                                disabled={uploadStates.ownership.uploading}
                                isLoading={uploadStates.ownership.uploading}
                                icon={Upload}
                            >
                                Mülkiyet Belgesini Yükle
                            </Button>
                        </div>
                    )}
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                        variant="secondary" 
                        onClick={handleClose}
                        disabled={uploadStates.nationalId.uploading || uploadStates.ownership.uploading}
                    >
                        Kapat
                    </Button>
                </div>
            </div>
        </Modal>
    );
} 