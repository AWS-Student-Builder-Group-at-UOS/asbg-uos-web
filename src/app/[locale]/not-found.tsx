import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getDict } from "@/lib/i18n";

/* not-found는 locale 파라미터를 받지 못하므로 두 언어를 함께 보여준다. */
export default function NotFound() {
  const ko = getDict("ko").notFound;
  const en = getDict("en").notFound;

  return (
    <Container className="flex flex-col items-center py-32 text-center">
      <p className="font-mono text-6xl font-semibold text-accent">404</p>
      <h1 className="mt-6 text-2xl font-semibold">{ko.title}</h1>
      <p className="mt-2 text-muted">{ko.body}</p>
      <p className="mt-6 text-sm text-faint">
        {en.title}. {en.body}
      </p>
      <ButtonLink href="/ko" variant="ghost" className="mt-10">
        {ko.home} · {en.home}
      </ButtonLink>
    </Container>
  );
}
