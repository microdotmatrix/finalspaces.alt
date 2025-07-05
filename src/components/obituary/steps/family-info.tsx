"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";

export const FamilyInformation = ({
  formData,
  addFamilyMember,
  updateFamilyMember,
  removeFamilyMember,
}: any) => (
  <Card>
    <CardHeader className="sr-only">
      <CardTitle>Family Information</CardTitle>
      <CardDescription>
        List family members who survive them and those who preceded them in
        death
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Survived By */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium">Survived By</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addFamilyMember("survivedBy")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Family Member
          </Button>
        </div>

        {formData.survivedBy.map((member: any) => (
          <div
            key={member.id}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg"
          >
            <Input
              name="name"
              placeholder="Name"
              value={member.name}
              onChange={(e) =>
                updateFamilyMember(
                  "survivedBy",
                  member.id,
                  "name",
                  e.target.value
                )
              }
            />
            <Input
              name="relationship"
              placeholder="Relationship"
              value={member.relationship}
              onChange={(e) =>
                updateFamilyMember(
                  "survivedBy",
                  member.id,
                  "relationship",
                  e.target.value
                )
              }
            />
            <Input
              name="location"
              placeholder="Location (optional)"
              value={member.location || ""}
              onChange={(e) =>
                updateFamilyMember(
                  "survivedBy",
                  member.id,
                  "location",
                  e.target.value
                )
              }
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeFamilyMember("survivedBy", member.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Predeceased */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium">Preceded in Death By</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addFamilyMember("predeceased")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Family Member
          </Button>
        </div>

        {formData.predeceased.map((member: any) => (
          <div
            key={member.id}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg"
          >
            <Input
              name="name"
              placeholder="Name"
              value={member.name}
              onChange={(e) =>
                updateFamilyMember(
                  "predeceased",
                  member.id,
                  "name",
                  e.target.value
                )
              }
            />
            <Input
              name="relationship"
              placeholder="Relationship"
              value={member.relationship}
              onChange={(e) =>
                updateFamilyMember(
                  "predeceased",
                  member.id,
                  "relationship",
                  e.target.value
                )
              }
            />
            <Input
              name="location"
              placeholder="Location (optional)"
              value={member.location || ""}
              onChange={(e) =>
                updateFamilyMember(
                  "predeceased",
                  member.id,
                  "location",
                  e.target.value
                )
              }
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeFamilyMember("predeceased", member.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
