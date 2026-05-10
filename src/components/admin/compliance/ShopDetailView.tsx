'use client'

import React from 'react'
import { 
  ShieldCheck, 
  MapPin, 
  User, 
  Building2, 
  CreditCard, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  XSquare,
  Clock,
  ArrowLeft,
  ExternalLink,
  Info,
  Calendar,
  Pause,
  Archive,
  Play,
  Trash2
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AuditLogList } from './AuditLogList'
import { 
  verifyDocument, 
  updateShopVerification, 
  updateShopStatus, 
  deleteShopPermanently 
} from '@/app/seller/admin-actions'
import { ShopVerificationStatus, ShopStatus } from '@prisma/client'
import { toast } from 'sonner'
import { AdminDocumentUpload } from './AdminDocumentUpload'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

interface ShopDetailViewProps {
  shop: any
}

export function ShopDetailView({ shop }: ShopDetailViewProps) {
  const router = useRouter()
  const [isVerifying, setIsVerifying] = React.useState<string | null>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)

  const handleVerifyDoc = async (docId: string, status: 'VERIFIED' | 'REJECTED', reason?: string) => {
    setIsVerifying(docId)
    const res = await verifyDocument(docId, status, reason)
    if (res.success) {
      toast.success(status === 'VERIFIED' ? 'Document validé ✅' : 'Document rejeté ❌')
      window.location.reload()
    } else {
      toast.error(res.error)
    }
    setIsVerifying(null)
  }

  const handleUpdateVerification = async (isVerified: boolean) => {
    const status = isVerified ? 'VERIFIED' : 'INCOMPLETE' as ShopVerificationStatus
    const res = await updateShopVerification(shop.id, isVerified, status)
    if (res.success) {
      toast.success(isVerified ? 'Boutique vérifiée ! 🛡️' : 'Vérification retirée.')
      window.location.reload()
    } else {
      toast.error(res.error)
    }
  }

  const handleStatusChange = async (status: ShopStatus) => {
    setIsProcessing(true)
    const res = await updateShopStatus(shop.id, status)
    if (res.success) {
      toast.success(`Statut mis à jour : ${status} 🔄`)
      window.location.reload()
    } else {
      toast.error(res.error)
    }
    setIsProcessing(false)
  }

  const handleDelete = async () => {
    setIsProcessing(true)
    const res = await deleteShopPermanently(shop.id)
    if (res.success) {
      toast.success('Boutique supprimée définitivement.')
      router.push('/admin/shops')
    } else {
      toast.error(res.error)
    }
    setIsProcessing(false)
  }

  return (
    <div className="space-y-12">
      {/* Header / Summary */}
      <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
           <div className="w-24 h-24 rounded-[32px] bg-muted overflow-hidden border-2 border-slate-50 shadow-inner">
              <img src={shop.logo || 'https://via.placeholder.com/150'} alt="logo" className="w-full h-full object-cover" />
           </div>
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <h1 className="text-3xl font-black text-primary uppercase tracking-tight">{shop.name}</h1>
                 {shop.isVerified && <Badge className="bg-secondary text-primary border-none text-[10px] uppercase font-black tracking-widest"><ShieldCheck size={12} className="mr-1.5" /> Officiel</Badge>}
                 {shop.status === 'ARCHIVED' && <Badge className="bg-slate-100 text-slate-500 border-none text-[10px] uppercase font-black tracking-widest"><Archive size={12} className="mr-1.5" /> Archivé</Badge>}
                 {shop.status === 'SUSPENDED' && <Badge className="bg-yellow-100 text-yellow-600 border-none text-[10px] uppercase font-black tracking-widest"><Pause size={12} className="mr-1.5" /> Suspendu</Badge>}
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-bold uppercase tracking-widest">
                 <div className="flex items-center gap-1.5 text-secondary"><MapPin size={16} /> {shop.country || 'N/A'}</div>
                 <div className="flex items-center gap-1.5"><User size={16} /> {shop.owner.email}</div>
                 <div className="flex items-center gap-1.5"><Calendar size={16} /> Crée le {format(new Date(shop.createdAt), 'dd MMM yyyy', { locale: fr })}</div>
              </div>
           </div>
        </div>

        <div className="flex flex-wrap gap-3">
           {/* Verification Toggle */}
           {shop.isVerified ? (
              <Button 
                variant="outline" 
                onClick={() => handleUpdateVerification(false)}
                className="rounded-full px-6 py-4 h-auto border-2 border-red-100 text-red-500 hover:bg-red-50 font-black uppercase text-[10px] tracking-widest"
              >
                Retirer Badge
              </Button>
           ) : (
              <Button 
                onClick={() => handleUpdateVerification(true)}
                className="bg-secondary hover:bg-secondary/90 text-primary rounded-full px-6 py-4 h-auto font-black uppercase text-[10px] tracking-widest shadow-xl shadow-secondary/20"
              >
                Vérifier
              </Button>
           )
           }

           {/* Status Controls */}
           <div className="h-10 w-px bg-slate-100 mx-1" />

           {(shop.status === 'SUSPENDED' || shop.status === 'ARCHIVED') ? (
              <Button 
                onClick={() => handleStatusChange('APPROVED' as any)}
                disabled={isProcessing}
                className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 py-4 h-auto font-black uppercase text-[10px] tracking-widest shadow-lg shadow-green-200"
              >
                <Play size={14} className="mr-2" /> Réactiver
              </Button>
           ) : (
              <Button 
                variant="outline"
                onClick={() => handleStatusChange('SUSPENDED' as any)}
                disabled={isProcessing}
                className="rounded-full px-6 py-4 h-auto border-2 border-yellow-200 text-yellow-600 hover:bg-yellow-50 font-black uppercase text-[10px] tracking-widest"
              >
                <Pause size={14} className="mr-2" /> Suspendre
              </Button>
           )}

           {shop.status !== 'ARCHIVED' && (
              <Button 
                variant="outline"
                onClick={() => handleStatusChange('ARCHIVED' as any)}
                disabled={isProcessing}
                className="rounded-full px-6 py-4 h-auto border-2 border-slate-200 text-slate-600 hover:bg-slate-100 font-black uppercase text-[10px] tracking-widest"
              >
                <Archive size={14} className="mr-2" /> Archiver
              </Button>
           )}

           {/* Danger Zone: Permanent Delete */}
           <AlertDialog>
              <AlertDialogTrigger
                render={(props) => (
                  <Button 
                    {...props}
                    variant="ghost"
                    className="rounded-full w-12 h-12 p-0 text-red-600 hover:bg-red-50"
                    title="Supprimer définitivement"
                  >
                    <Trash2 size={20} />
                  </Button>
                )}
              />
              <AlertDialogContent className="rounded-[40px] border-none p-10">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight text-primary">Suppression Critique</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground font-medium py-4 leading-relaxed">
                    Vous êtes sur le point de supprimer la boutique <span className="font-black text-primary">"{shop.name}"</span>. 
                    Cette action est irréversible et réservée uniquement aux boutiques de test.
                    <br/><br/>
                    <span className="text-red-700 font-bold bg-red-50 p-4 rounded-2xl block border border-red-100 italic">
                      Blocage automatique si des commandes ou des transactions financières sont détectées.
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-4">
                  <AlertDialogCancel className="rounded-full px-8 py-6 h-auto border-2 border-slate-100 font-bold uppercase text-[10px] tracking-widest">Annuler</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-6 h-auto font-black uppercase text-[10px] tracking-widest"
                  >
                    Confirmer la Suppression
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
           </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2/3) */}
        <div className="lg:col-span-2 space-y-8">
           {/* Section Profil Légal */}
           <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 flex flex-row items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Building2 className="text-secondary" size={20} />
                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary">Informations Légales & Profil</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="p-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Nom Légal de l'Entreprise</p>
                        <p className="text-lg font-bold text-primary">{shop.legalProfile?.legalBusinessName || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Numéro de Licence</p>
                        <p className="text-lg font-bold text-primary">{shop.legalProfile?.tradeLicenseNumber || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Pays de la Licence</p>
                        <p className="text-lg font-bold text-primary">{shop.legalProfile?.tradeLicenseCountry || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Expiration Licence</p>
                        <p className="text-lg font-bold text-primary">
                          {shop.legalProfile?.tradeLicenseExpiryDate ? format(new Date(shop.legalProfile.tradeLicenseExpiryDate), 'dd MMMM yyyy', { locale: fr }) : 'Non renseignée'}
                        </p>
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Section Coordonnées Bancaires (RIB) */}
           <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100">
                 <div className="flex items-center gap-3">
                    <CreditCard className="text-secondary" size={20} />
                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary">Coordonnées Bancaires (RIB/IBAN)</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="p-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Titulaire du Compte</p>
                        <p className="text-lg font-bold text-primary">{shop.legalProfile?.bankAccountName || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Nom de la Banque</p>
                        <p className="text-lg font-bold text-primary">{shop.legalProfile?.bankName || 'N/A'}</p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">IBAN / SWIFT</p>
                        <p className="text-xl font-black text-primary tracking-tight font-mono">
                          {shop.legalProfile?.iban || 'IBAN non fourni'} <span className="text-sm opacity-40 ml-4">/ SWIFT: {shop.legalProfile?.swiftCode || '-'}</span>
                        </p>
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Section Documents (Cœur de la validation) */}
           <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 px-10 py-6 border-b border-slate-100 flex flex-row items-center justify-between">
                 <div className="flex items-center gap-3">
                    <FileText className="text-secondary" size={20} />
                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary">Dossier Documentaire</CardTitle>
                 </div>
                 <AdminDocumentUpload shopId={shop.id} />
              </CardHeader>
              <CardContent className="p-10 space-y-8">
                 {shop.documents.length === 0 ? (
                    <div className="py-20 text-center">
                       <AlertTriangle size={32} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                       <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Aucun document soumis</p>
                    </div>
                 ) : (
                    shop.documents.map((doc: any) => (
                      <div key={doc.id} className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100 hover:bg-white transition-all group shadow-sm">
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                               <div className="w-16 h-16 rounded-[24px] bg-primary flex items-center justify-center text-secondary shadow-lg">
                                  <FileText size={24} />
                               </div>
                               <div>
                                  <h4 className="text-lg font-black text-primary uppercase tracking-tight">{doc.type}</h4>
                                  <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                                     <span className="flex items-center gap-1.5"><Clock size={14} /> Reçu le {format(new Date(doc.createdAt), 'dd/MM/yyyy')}</span>
                                     <a href={doc.fileUrl} target="_blank" className="text-secondary hover:underline flex items-center gap-1">Voir le fichier <ExternalLink size={14} /></a>
                                  </div>
                               </div>
                            </div>

                            <div className="flex items-center gap-3">
                               {doc.verificationStatus === 'VERIFIED' ? (
                                  <Badge className="bg-green-500/10 text-green-600 border-none px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest"><CheckCircle2 size={14} className="mr-2" /> Validé</Badge>
                               ) : doc.verificationStatus === 'REJECTED' ? (
                                  <Badge className="bg-red-500/10 text-red-600 border-none px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-widest"><XSquare size={14} className="mr-2" /> Rejeté</Badge>
                               ) : (
                                  <div className="flex gap-2">
                                     <Button 
                                        variant="outline" 
                                        onClick={() => handleVerifyDoc(doc.id, 'REJECTED', 'Propriété ou validité incorrecte.')}
                                        disabled={isVerifying === doc.id}
                                        className="rounded-full border-red-200 text-red-600 hover:bg-red-50 px-6 font-bold text-[10px] uppercase tracking-widest"
                                     >
                                        Rejeter
                                     </Button>
                                     <Button 
                                        onClick={() => handleVerifyDoc(doc.id, 'VERIFIED')}
                                        disabled={isVerifying === doc.id}
                                        className="bg-green-500 hover:bg-green-600 text-white rounded-full px-6 font-bold text-[10px] uppercase tracking-widest"
                                     >
                                        Valider
                                     </Button>
                                  </div>
                               )}
                            </div>
                         </div>
                         {doc.rejectionReason && (
                           <div className="mt-4 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
                              <Info size={16} className="text-red-500 shrink-0 mt-0.5" />
                              <p className="text-xs font-bold text-red-700 italic">Raison du rejet : {doc.rejectionReason}</p>
                           </div>
                         )}
                      </div>
                    ))
                 )}
              </CardContent>
           </Card>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-8">
           {/* Section Audit Log */}
           <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
              <CardContent className="p-8">
                 <AuditLogList events={shop.complianceEvents} />
              </CardContent>
           </Card>

           {/* Section Notes Internes */}
           <Card className="rounded-[40px] border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="bg-slate-50/50 px-8 py-6 border-b border-slate-100">
                 <div className="flex items-center gap-3 text-primary">
                    <Info size={18} />
                    <CardTitle className="text-xs font-black uppercase tracking-widest">Notes Admin Internes</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="p-8">
                 <p className="text-xs text-muted-foreground font-medium italic mb-4 leading-relaxed">
                   Notes visibles uniquement par l'équipe administrative. Utile pour le suivi des relances ou des spécificités métier.
                 </p>
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm font-bold text-primary">
                    {shop.legalProfile?.notes || 'Aucune note interne pour le moment.'}
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
