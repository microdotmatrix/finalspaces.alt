"use client";

import { Button } from "@/components/ui/button";
import {
  generateObituaryText,
  saveObituaryDraft,
} from "@/lib/actions/obituary";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AdditionalInformation } from "./steps/additional-info";
import { BiographicalInformation } from "./steps/biographical-info";
import { FamilyInformation } from "./steps/family-info";
import { PersonalInformation } from "./steps/personal-info";
import { ServiceInformation } from "./steps/service-info";

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  location?: string;
}

interface ServiceDetails {
  type: string;
  date?: Date;
  time?: string;
  location?: string;
  address?: string;
  officiant?: string;
}

interface ObituaryFormData {
  // Personal Information
  fullName: string;
  nickname?: string;
  age?: number;
  dateOfBirth?: Date;
  dateOfDeath?: Date;
  placeOfBirth?: string;
  placeOfDeath?: string;
  causeOfDeath?: string;

  // Biographical Information
  biography: string;
  education?: string;
  career?: string;
  militaryService?: string;
  hobbies?: string;
  achievements?: string;
  personalityTraits?: string;

  // Family Information
  survivedBy: FamilyMember[];
  predeceased: FamilyMember[];

  // Service Information
  services: ServiceDetails[];

  // Additional Information
  charityDonations?: string;
  specialRequests?: string;
  photoDescription?: string;
}

interface ObituaryFormProps {
  initialData?: Partial<ObituaryFormData>;
  userId: string;
}

const STEPS = [
  {
    id: "personal",
    title: "Personal Information",
    description: "Basic details about your loved one",
  },
  {
    id: "biography",
    title: "Life Story",
    description: "Their journey, achievements, and character",
  },
  {
    id: "family",
    title: "Family Information",
    description: "Family members who survive them and those who preceded them",
  },
  {
    id: "services",
    title: "Service Information",
    description: "Memorial and funeral service details",
  },
  {
    id: "additional",
    title: "Additional Information",
    description: "Any other details you'd like to include",
  },
] as const;

type StepId = (typeof STEPS)[number]["id"];

/**
 * A form component for creating an obituary.
 *
 * @param {ObituaryFormProps} props
 * @param {Partial<ObituaryFormData>} props.initialData Initial data to populate the form with.
 * @param {string} props.userId The user ID of the person creating the obituary.
 * @returns A JSX element representing the form.
 */
export const ObituaryForm = ({ initialData, userId }: ObituaryFormProps) => {
  const [currentStep, setCurrentStep] = useState<StepId>("personal");
  const [formData, setFormData] = useState<ObituaryFormData>({
    fullName: "",
    biography: "",
    survivedBy: [],
    predeceased: [],
    services: [],
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addFamilyMember = (type: "survivedBy" | "predeceased") => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: "",
      relationship: "",
    };

    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], newMember],
    }));
  };

  const updateFamilyMember = (
    type: "survivedBy" | "predeceased",
    id: string,
    field: keyof FamilyMember,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      ),
    }));
  };

  const removeFamilyMember = (
    type: "survivedBy" | "predeceased",
    id: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((member) => member.id !== id),
    }));
  };

  const addService = () => {
    const newService: ServiceDetails = {
      type: "",
    };

    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, newService],
    }));
  };

  const updateService = (
    index: number,
    field: keyof ServiceDetails,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      ),
    }));
  };

  const removeService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }));
  };

  const getCurrentStepIndex = () =>
    STEPS.findIndex((step) => step.id === currentStep);
  const isFirstStep = getCurrentStepIndex() === 0;
  const isLastStep = getCurrentStepIndex() === STEPS.length - 1;

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case "personal":
        if (!formData.fullName.trim()) {
          newErrors.fullName = "Full name is required";
        }
        if (
          formData.dateOfBirth &&
          formData.dateOfDeath &&
          formData.dateOfBirth > formData.dateOfDeath
        ) {
          newErrors.dateOfDeath =
            "Date of death cannot be before date of birth";
        }
        break;
      case "biography":
        if (!formData.biography.trim()) {
          newErrors.biography = "Biography is required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.biography.trim()) {
      newErrors.biography = "Biography is required";
    }

    if (
      formData.dateOfBirth &&
      formData.dateOfDeath &&
      formData.dateOfBirth > formData.dateOfDeath
    ) {
      newErrors.dateOfDeath = "Date of death cannot be before date of birth";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      const currentIndex = getCurrentStepIndex();
      if (currentIndex < STEPS.length - 1) {
        setCurrentStep(STEPS[currentIndex + 1].id);
      }
    }
  };

  const handlePrevious = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1].id);
    }
  };

  const [generatedObituary, setGeneratedObituary] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // This is the client-side function that calls the server action
  const handleFormSubmit = async (formData: FormData) => {
    setGeneratedObituary(""); // Clear previous result
    startTransition(async () => {
      const { obituary } = await generateObituaryText(userId, formData);
      startTransition(async () => {
        try {
          // for await (const delta of readStreamableValue(obituary!)) {
          //   setGeneratedObituary((current) => `${current}${delta}`);
          // }
          setGeneratedObituary(obituary);
          toast.success("Obituary generated successfully!");
        } catch (error) {
          console.error("Error generating obituary text:", error);
          toast.error("Failed to generate obituary text");
          setError(error as string);
        }
      });
    });
  };

  const handleSaveDraft = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await saveObituaryDraft(userId, formData);
        toast.success("Obituary draft saved successfully!");
      } catch (error) {
        console.error("Error saving obituary draft:", error);
        toast.error("Failed to save obituary draft");
        setError(error as string);
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-stretch">
      <section className="flex-2">
        <div className="max-w-4xl mx-auto p-6 relative">
          {/* Progress Indicator */}
          <div className="grid grid-cols-5 place-content-center mb-4 w-full">
            {STEPS.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = getCurrentStepIndex() > index;

              return (
                <div
                  key={step.id}
                  className="flex items-center justify-center w-full"
                >
                  <div
                    className={cn(
                      "size-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold">
              {STEPS.find((step) => step.id === currentStep)?.title}
            </h2>
            <p className="text-muted-foreground text-sm">
              {STEPS.find((step) => step.id === currentStep)?.description}
            </p>
          </div>
          {/* Form Content */}
          <form action={handleFormSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <CurrentStep
                  currentStep={currentStep}
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                  addFamilyMember={addFamilyMember}
                  updateFamilyMember={updateFamilyMember}
                  removeFamilyMember={removeFamilyMember}
                  addService={addService}
                  updateService={updateService}
                  removeService={removeService}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mb-8">
              <ProgressBar
                currentStep={getCurrentStepIndex()}
                totalSteps={STEPS.length}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {!isFirstStep && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" formAction={handleSaveDraft}>
                  Save as Draft
                </Button>

                {isLastStep ? (
                  <Button type="submit" disabled={isPending}>
                    Generate Obituary
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNext}>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>
      <section className="flex-3">
        <Card>
          <CardHeader>
            <CardTitle>
              {generatedObituary ? "Generated Obituary" : "Generate Obituary"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPending ? (
              <p>Generating obituary...</p>
            ) : (
              <div className="whitespace-pre-wrap">{generatedObituary}</div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Failed to Generate Obituary</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setGeneratedObituary("")}
              >
                Clear Output
              </Button>
              {/* Add options to copy, save, etc. here */}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => (
  <motion.div
    className="mt-4 h-2 rounded-full bg-primary"
    initial={{ width: "0%" }}
    animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
  />
);

type StepProps = {
  currentStep: StepId;
  formData: ObituaryFormData;
  setFormData: (data: ObituaryFormData) => void;
  errors: Record<string, string>;
  addFamilyMember: (type: "survivedBy" | "predeceased") => void;
  updateFamilyMember: (
    type: "survivedBy" | "predeceased",
    id: string,
    field: keyof FamilyMember,
    value: string
  ) => void;
  removeFamilyMember: (type: "survivedBy" | "predeceased", id: string) => void;
  addService: () => void;
  updateService: (
    index: number,
    field: keyof ServiceDetails,
    value: any
  ) => void;
  removeService: (index: number) => void;
};

const CurrentStep = ({
  currentStep,
  formData,
  setFormData,
  errors,
  addFamilyMember,
  updateFamilyMember,
  removeFamilyMember,
  addService,
  updateService,
  removeService,
}: StepProps) => {
  switch (currentStep) {
    case "personal":
      return (
        <PersonalInformation
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />
      );
    case "biography":
      return (
        <BiographicalInformation
          formData={formData}
          setFormData={setFormData}
          errors={errors}
        />
      );
    case "family":
      return (
        <FamilyInformation
          formData={formData}
          addFamilyMember={addFamilyMember}
          updateFamilyMember={updateFamilyMember}
          removeFamilyMember={removeFamilyMember}
          errors={errors}
        />
      );
    case "services":
      return (
        <ServiceInformation
          formData={formData}
          addService={addService}
          updateService={updateService}
          removeService={removeService}
          errors={errors}
        />
      );
    case "additional":
      return (
        <AdditionalInformation formData={formData} setFormData={setFormData} />
      );
    default:
      return null;
  }
};
