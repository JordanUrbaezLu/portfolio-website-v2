import { SectionHead } from "@/components/ui/SectionHead";
import { skillGroups } from "@/data/skills";

export function Skills() {
  return (
    <section id="stack" className="px-4 pt-28 md:px-5 md:pt-36">
      <div className="mx-auto max-w-[86rem]">
        <SectionHead
          code="Stack"
          title="What I reach for"
          note="Grouped by what the tools are for. No star ratings — a stack is a set of choices, not a self-assessment."
        />

        <div className="mt-12">
          {skillGroups.map((group) => (
            <div
              key={group.code}
              className="grid gap-x-12 gap-y-4 border-b border-rule py-8 lg:grid-cols-[19rem_minmax(0,1fr)]"
            >
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="label">{group.code}</span>
                  <h3 className="display-sm text-lg text-paper">
                    {group.title}
                  </h3>
                </div>
                <p className="mt-2 text-[0.9375rem] leading-snug text-faint">
                  {group.note}
                </p>
              </div>

              <ul className="flex flex-wrap gap-x-6 gap-y-3 self-center">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-[0.9375rem] leading-none text-dim"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
