"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const BiographicalInformation = ({
  formData,
  setFormData,
  errors,
}: any) => (
  <Card>
    <CardHeader className="sr-only">
      <CardTitle>Life Story</CardTitle>
      <CardDescription>
        Tell us about their life, achievements, and what made them special
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="biography">Biography/Life Story *</Label>
        <Textarea
          name="biography"
          rows={6}
          value={formData.biography}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, biography: e.target.value }))
          }
          placeholder="Share their life story, what they were passionate about, their character, and memorable moments..."
          className={errors.biography ? "border-destructive" : ""}
        />
        {errors.biography && (
          <p className="text-sm text-destructive">{errors.biography}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="education">Education</Label>
          <Textarea
            name="education"
            rows={3}
            value={formData.education || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                education: e.target.value,
              }))
            }
            placeholder="Schools attended, degrees earned..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="career">Career/Profession</Label>
          <Textarea
            name="career"
            rows={3}
            value={formData.career || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, career: e.target.value }))
            }
            placeholder="Work history, accomplishments..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hobbies">Hobbies & Interests</Label>
          <Textarea
            name="hobbies"
            rows={3}
            value={formData.hobbies || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({ ...prev, hobbies: e.target.value }))
            }
            placeholder="What they loved to do in their free time..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="achievements">Special Achievements</Label>
          <Textarea
            name="achievements"
            rows={3}
            value={formData.achievements || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                achievements: e.target.value,
              }))
            }
            placeholder="Awards, recognitions, special accomplishments..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="personalityTraits">Personality & Character</Label>
        <Textarea
          name="personalityTraits"
          rows={3}
          value={formData.personalityTraits || ""}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              personalityTraits: e.target.value,
            }))
          }
          placeholder="What kind of person they were, their values, how they touched others' lives..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="militaryService">Military Service</Label>
        <Textarea
          name="militaryService"
          rows={2}
          value={formData.militaryService || ""}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              militaryService: e.target.value,
            }))
          }
          placeholder="Branch, rank, years of service, honors..."
        />
      </div>
    </CardContent>
  </Card>
);
