'use client'

import { useState } from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Badge,
  Card,
  Avatar
} from '@/app/components/ui'
import { User, Phone, Building2, Loader2 } from 'lucide-react'
import { useMaintenanceTechnicians } from '@/hooks/useMaintenanceTechnicians'
import { ServiceRequest } from '@/services/types/request-list.types'
import { ticketService } from '@/services/ticket.service'
import { useToast } from '@/hooks/useToast'

interface AssignTechnicianModalProps {
  isOpen: boolean
  onClose: () => void
  request: ServiceRequest | null
  onAssign: (technicianId: string) => Promise<void>
}

export default function AssignTechnicianModal({
  isOpen,
  onClose,
  request,
  onAssign
}: AssignTechnicianModalProps) {
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('')
  const [isAssigning, setIsAssigning] = useState(false)
  const { data: technicians, isLoading } = useMaintenanceTechnicians()
  const { success, error } = useToast()

  const handleAssign = async () => {
    if (!selectedTechnicianId || !request) {
      error('Lütfen bir teknisyen seçin')
      return
    }

    try {
      setIsAssigning(true)
      await onAssign(selectedTechnicianId)
      success('Teknisyen başarıyla atandı')
      onClose()
      setSelectedTechnicianId('')
    } catch (err) {
      console.error('Failed to assign technician:', err)
      error('Teknisyen ataması sırasında hata oluştu')
    } finally {
      setIsAssigning(false)
    }
  }

  const handleClose = () => {
    if (!isAssigning) {
      onClose()
      setSelectedTechnicianId('')
    }
  }

  // Teknisyen seçeneklerini hazırla
  const technicianOptions = technicians?.map(tech => ({
    value: tech.id,
    label: `${tech.firstName} ${tech.lastName}`
  })) || []

  const selectedTechnician = technicianOptions.find(t => t.value === selectedTechnicianId)

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalHeader className="pb-6">
        <ModalTitle className="flex items-center gap-3 text-xl font-semibold">
          <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          Teknisyen Ata
        </ModalTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-11">
          Bu talep için uygun bir teknisyen seçin ve atama işlemini gerçekleştirin.
        </p>
      </ModalHeader>

        <ModalBody scrollable={false}>
        {request && (
          <div className="space-y-6">
            {/* Request Info */}
            <Card className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-600">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base text-gray-900 dark:text-gray-100">
                      {request.title}
                    </h3>
                  </div>
                  <Badge variant="soft" color={request.priority.id === 'high' ? 'danger' : request.priority.id === 'low' ? 'success' : 'warning'} className="font-medium px-3 py-1">
                    {request.priority.label}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-text-light-secondary dark:text-text-secondary">
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    <span>{request.apartment.number} - {request.apartment.block}</span>
                  </div>
                  {request.apartment.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span>{request.apartment.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Technician Selection */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                Teknisyen Seçin
              </label>
              

              
              <Select
                value={selectedTechnicianId}
                onValueChange={setSelectedTechnicianId}
                disabled={isLoading || isAssigning}
              >
                <SelectTrigger className="w-full h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
                  <SelectValue placeholder="Teknisyen seçin..." className="text-gray-500" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2 text-sm">Teknisyenler yükleniyor...</span>
                    </div>
                  ) : technicianOptions.length === 0 ? (
                    <div className="text-center py-4 text-sm text-text-light-secondary dark:text-text-secondary">
                      Müsait teknisyen bulunamadı
                    </div>
                  ) : (
                    technicianOptions.map((technician) => (
                      <SelectItem key={technician.value} value={technician.value}>
                        <div className="flex items-center gap-2">
                          <Avatar 
                            className="h-6 w-6"
                            fallback={technician.label.split(' ').map(n => n[0]).join('').toUpperCase()}
                          />
                          <span>{technician.label}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {/* Selected Technician Preview */}
              {selectedTechnician && (
                <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700">
                  <div className="flex items-center gap-3">
                    <Avatar 
                      className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold"
                      fallback={selectedTechnician.label.split(' ').map(n => n[0]).join('').toUpperCase()}
                    />
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                        {selectedTechnician.label}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        Seçili Teknisyen
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
        </ModalBody>

        <ModalFooter className="flex gap-3 pt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isAssigning}
            className="flex-1 h-11 text-sm font-medium border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition-all duration-200"
          >
            İptal
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAssign}
            disabled={!selectedTechnicianId || isAssigning || isLoading}
            className="flex-1 border border-primary-gold/20"
          >
            {isAssigning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Atanıyor...
              </>
            ) : (
              <>
                <User className="mr-2 h-4 w-4" />
                Teknisyen Ata
              </>
            )}
          </Button>
        </ModalFooter>
    </Modal>
  )
}