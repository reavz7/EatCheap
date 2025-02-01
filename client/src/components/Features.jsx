import { Users, Tally1, Tally2, Tally3 } from "lucide-react"

const features = [
  {
    name: "Dodaj składniki",
    description: "Na sam początek w zakładce profil dodaj swoje składniki które posiadasz w swoim domu",
    icon: Tally1,
  },
  {
    name: "Zdobądź sugestie",
    description: "Kiedy wszystkie składniki znajdują się w twoim profilu, teraz w zakładce sugestie zobaczysz możliwe do zrobienia przepisy",
    icon: Tally2,
  },
  {
    name: "Przepisy",
    description: "W wolnej chwili w zakładce przepisy możesz zobaczyć wszystkie nasze przepisy. Może coś wpadnie Ci w oko i zaplanujesz następne zakupy?",
    icon: Tally3,
  },
  {
    name: "Profil",
    description: "W zakładce profil, oprócz dodawnia składników możesz dodatkowo edytować swoje dane",
    icon: Users,
  },
]

const Features = () => {
  return (
    <section className="space-y-16 md:py-32">
      <div className="mx-auto max-w-[58rem] text-center">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Jak korzystać?</h2>
        <p className="mt-4 text-muted-foreground sm:text-lg">
          I jak w pełni wykorzystać wszsytkie funkcje w aplikacji
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 ">
        {features.map((feature) => (
          <div key={feature.name} className="relative overflow-hidden rounded-lg border bg-background p-8">
            <div className="flex items-center gap-4">
              <feature.icon className="h-8 w-8" />
              <h3 className="font-bold">{feature.name}</h3>
            </div>
            <p className="mt-2 text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features

