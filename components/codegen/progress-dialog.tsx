// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
// import { Progress } from '@/components/ui/progress'

// interface ProgressDialogProps {
//   open: boolean
//   progress: number
//   total: number
//   processed: number
// }

// export function ProgressDialog({ open, progress, total, processed }: ProgressDialogProps) {
//   return (
//     <Dialog open={open}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Sending Emails</DialogTitle>
//         </DialogHeader>
//         <div className="py-6">
//           <Progress value={progress} className="mb-2" />
//           <p className="text-sm text-muted-foreground text-center">
//             Processed {processed} of {total} emails ({Math.round(progress)}%)
//           </p>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }