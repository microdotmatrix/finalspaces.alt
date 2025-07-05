"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "../date";

export const PersonalInformation = ({ formData, setFormData, errors }: any) => (
  <Card>
    <CardHeader className="sr-only">
      <CardTitle>Personal Information</CardTitle>
      <CardDescription>Basic details about your loved one</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                fullName: e.target.value,
              }))
            }
            className={errors.fullName ? "border-destructive" : ""}
            required
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nickname">Nickname/Known As</Label>
          <Input
            id="nickname"
            name="nickname"
            value={formData.nickname || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                nickname: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="flex flex-col items-start">
            Date of Birth
            <DatePicker
              date={formData.dateOfBirth}
              onDateChange={(date) =>
                setFormData((prev: any) => ({ ...prev, dateOfBirth: date }))
              }
              placeholder="Select birth date"
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-destructive">{errors.dateOfBirth}</p>
            )}
          </Label>
        </div>

        <div className="space-y-2">
          <Label className="flex flex-col items-start">
            Date of Death
            <DatePicker
              date={formData.dateOfDeath}
              onDateChange={(date) =>
                setFormData((prev: any) => ({ ...prev, dateOfDeath: date }))
              }
              placeholder="Select death date"
            />
            {errors.dateOfDeath && (
              <p className="text-sm text-destructive">{errors.dateOfDeath}</p>
            )}
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age at Death</Label>
          <Input
            id="age"
            name="age"
            type="number"
            value={formData.age || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                age: parseInt(e.target.value) || undefined,
              }))
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="placeOfBirth">Place of Birth *</Label>
          <Input
            id="placeOfBirth"
            name="placeOfBirth"
            defaultValue={formData.placeOfBirth}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                placeOfBirth: e.target.value,
              }))
            }
            className={errors.placeOfBirth ? "border-destructive" : ""}
            required
          />
          {errors.placeOfBirth && (
            <p className="text-sm text-destructive">{errors.placeOfBirth}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="placeOfDeath">Place of Death *</Label>
          <Input
            id="placeOfDeath"
            name="placeOfDeath"
            defaultValue={formData.placeOfDeath}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                placeOfDeath: e.target.value,
              }))
            }
            className={errors.placeOfDeath ? "border-destructive" : ""}
            required
          />
          {errors.placeOfDeath && (
            <p className="text-sm text-destructive">{errors.placeOfDeath}</p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);
