export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white text-xs font-bold shadow-sm">
                G
              </div>
              <span className="text-sm font-semibold">Corporate</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Plataforma completa para gestão corporativa moderna. Segurança, eficiência
              e inteligência em um só lugar.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">Produto</h4>
            <ul className="space-y-2">
              {["Recursos", "Preços", "Integrações", "API"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">Empresa</h4>
            <ul className="space-y-2">
              {["Sobre", "Blog", "Carreiras", "Contato"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-black/5 pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {year} Corporate Gestão. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
