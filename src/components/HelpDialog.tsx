import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface HelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 text-sm">
          <section aria-label="Global shortcuts">
            <h3 className="mb-2 font-medium text-foreground">Global</h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="py-1 pr-4 text-muted-foreground">Toggle fullscreen</td>
                  <td className="py-1 text-right"><kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">F</kbd></td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-muted-foreground">Open / close settings</td>
                  <td className="py-1 text-right"><kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">S</kbd></td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-muted-foreground">Open / close this help</td>
                  <td className="py-1 text-right"><kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">?</kbd></td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-muted-foreground">Select preset 1–9</td>
                  <td className="py-1 text-right"><kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">1</kbd>–<kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">9</kbd></td>
                </tr>
              </tbody>
            </table>
          </section>

          <section aria-label="Light surface shortcuts">
            <h3 className="mb-2 font-medium text-foreground">Light surface</h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="py-1 pr-4 text-muted-foreground">Brightness up / down</td>
                  <td className="py-1 text-right">
                    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">↑</kbd>
                    {' / '}
                    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">↓</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-muted-foreground">Colour temperature warmer / cooler</td>
                  <td className="py-1 text-right">
                    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">←</kbd>
                    {' / '}
                    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">→</kbd>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section aria-label="Ring and Spot radius shortcuts">
            <h3 className="mb-2 font-medium text-foreground">Ring &amp; Spot radius</h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="py-1 pr-4 text-muted-foreground">Outer radius increase / decrease</td>
                  <td className="py-1 text-right">
                    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">]</kbd>
                    {' / '}
                    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">[</kbd>
                  </td>
                </tr>
                <tr>
                  <td className="py-1 pr-4 text-muted-foreground">Inner radius increase / decrease</td>
                  <td className="py-1 text-right">
                    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">{'{'}</kbd>
                    {' / '}
                    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">{'}'}</kbd>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section aria-label="Settings modal shortcuts">
            <h3 className="mb-2 font-medium text-foreground">Settings modal</h3>
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="py-1 pr-4 text-muted-foreground">Close settings</td>
                  <td className="py-1 text-right"><kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">Esc</kbd></td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">v{import.meta.env.VITE_APP_VERSION}</p>
      </DialogContent>
    </Dialog>
  )
}
