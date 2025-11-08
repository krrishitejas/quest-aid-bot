import { FormulaBox } from "./FormulaBox";
import { AlertCircle, Lightbulb, CheckCircle } from "lucide-react";

interface SessionContentProps {
  session: {
    summary: string;
    keyPoints: string[];
    formulas?: Array<{
      name: string;
      formula: string;
      variables: string;
      whenToUse: string;
    }>;
    examples?: Array<{
      description: string;
      relatesTo: string;
      explanation: string;
    }>;
    commonMistakes?: string[];
    mnemonics?: string[];
  };
}

export const SessionContent = ({ session }: SessionContentProps) => {
  return (
    <div className="bg-card rounded-2xl shadow-md p-8 space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <p className="text-muted-foreground leading-relaxed text-lg">{session.summary}</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Key Points</h2>
        <div className="space-y-3">
          {session.keyPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-accent/5 rounded-xl">
              <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">{point}</p>
            </div>
          ))}
        </div>
      </section>

      {session.formulas && session.formulas.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Important Formulas</h2>
          <div className="space-y-4">
            {session.formulas.map((formula, i) => (
              <FormulaBox key={i} formula={formula} />
            ))}
          </div>
        </section>
      )}

      {session.examples && session.examples.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Real-World Examples</h2>
          <div className="space-y-4">
            {session.examples.map((example, i) => (
              <div key={i} className="p-6 bg-accent/10 rounded-xl border-l-4 border-primary">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{example.description}</span>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {example.relatesTo}
                  </span>
                </div>
                <p className="text-muted-foreground">{example.explanation}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {session.mnemonics && session.mnemonics.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Memory Aids</h2>
          <div className="space-y-3">
            {session.mnemonics.map((mnemonic, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-warning/10 rounded-xl border border-warning/20">
                <Lightbulb className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                <p className="font-medium">{mnemonic}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {session.commonMistakes && session.commonMistakes.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Common Mistakes to Avoid</h2>
          <div className="space-y-3">
            {session.commonMistakes.map((mistake, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-destructive/5 rounded-xl border border-destructive/20">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">{mistake}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
