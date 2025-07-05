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

export const AdditionalInformation = ({ formData, setFormData }: any) => (
  <Card>
    <CardHeader className="sr-only">
      <CardTitle>Additional Information</CardTitle>
      <CardDescription>Any other details you'd like to include</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="charityDonations">Memorial Donations</Label>
        <Textarea
          name="charityDonations"
          rows={3}
          defaultValue={formData.charityDonations || ""}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              charityDonations: e.target.value,
            }))
          }
          placeholder="In lieu of flowers, donations may be made to..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialRequests">Special Requests or Notes</Label>
        <Textarea
          name="specialRequests"
          rows={3}
          defaultValue={formData.specialRequests || ""}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              specialRequests: e.target.value,
            }))
          }
          placeholder="Any special requests, dress code, or additional information..."
        />
      </div>

      <div className="space-y-2 scroll-mt-24">
        <Label htmlFor="photoDescription">Photo Description</Label>
        <Textarea
          name="photoDescription"
          rows={2}
          defaultValue={formData.photoDescription || ""}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              photoDescription: e.target.value,
            }))
          }
          placeholder="Describe the photo you'd like to use or any specific photo requirements..."
        />
      </div>
    </CardContent>
  </Card>
);
