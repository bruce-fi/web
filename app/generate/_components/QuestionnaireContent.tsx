import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Select, SelectItem } from "@heroui/select";
import { dataForm } from "@/data/dataForm";
import { useGenerateAI } from "@/hooks/mutation/api/useGenerateAI";
import { Loader2 } from "lucide-react";

interface FormData {
  [key: number]: number | null;
}

export default function QuestionnaireContent() {
  const [formData, setFormData] = useState<FormData>({});

  const { mutation } = useGenerateAI()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasEmptyAnswers = Object.values(formData).some(
      (value) => value === null || value === undefined
    );

    if (Object.keys(formData).length !== dataForm.questions.length || hasEmptyAnswers) {
      alert("Please answer all questions");
      return;
    }

    const formattedSubmission = Object.entries(formData)
      .map(([questionIndex, answerIndex]) => {
        const qIndex = parseInt(questionIndex);
        return `${dataForm.questions[qIndex].question} = ${dataForm.questions[qIndex].options[answerIndex as number]
          }`;
      })
      .join(". ");

    mutation.mutate({
      formattedSubmission
    })
  };

  const handleChange = (index: number, value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      [index]: value === null ? null : parseInt(value),
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-lg font-normal">
        Fill the questionnaire to help us understand your needs.
      </p>
      <Form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full bg-background/30 p-5 rounded-2xl">
        {dataForm.questions.map((q, index) => (
          <div key={index} className="form-group flex flex-col gap-1 w-full">
            <p className="text-sm">{q.question}</p>
            <Select
              placeholder="Select an option"
              variant="bordered"
              className="w-full"
              classNames={{
                trigger: "min-h-16",
                listboxWrapper: "max-h-[400px]",
              }}
              onChange={(e) => handleChange(index, e?.target?.value || null)}
              required
              value={formData[index]?.toString() || ""}
            >
              {q.options.map((option, optIndex) => (
                <SelectItem key={optIndex} value={optIndex.toString()} aria-required aria-label={q.question} aria-labelledby={`question-${index}`}>
                  {option}
                </SelectItem>
              ))}
            </Select>
          </div>
        ))}

        <Button
          type="submit"
          className="w-full py-2 px-4 rounded-md"
          color="primary"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Submit</span>}
        </Button>
      </Form>
    </div>
  );
}