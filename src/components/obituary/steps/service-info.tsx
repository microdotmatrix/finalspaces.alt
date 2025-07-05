"use client";

import { DatePicker } from "@/components/obituary/date";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

export const ServiceInformation = ({
  formData,
  addService,
  updateService,
  removeService,
}: any) => (
  <Card>
    <CardHeader className="sr-only">
      <CardTitle>Service Information</CardTitle>
      <CardDescription>
        Details about funeral, memorial, or celebration of life services
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium">Services</h4>
        <Button type="button" variant="outline" size="sm" onClick={addService}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {formData.services.map((service: any, index: number) => (
        <div key={index} className="p-4 border rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="font-medium">Service {index + 1}</h5>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeService(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select
                value={service.type}
                onValueChange={(value) => updateService(index, "type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="funeral">Funeral Service</SelectItem>
                  <SelectItem value="memorial">Memorial Service</SelectItem>
                  <SelectItem value="celebration">
                    Celebration of Life
                  </SelectItem>
                  <SelectItem value="viewing">Viewing/Visitation</SelectItem>
                  <SelectItem value="burial">Burial Service</SelectItem>
                  <SelectItem value="cremation">Cremation Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <DatePicker
                date={service.date}
                onDateChange={(date) => updateService(index, "date", date)}
                placeholder="Select service date"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                name="time"
                placeholder="e.g., 2:00 PM"
                value={service.time || ""}
                onChange={(e) => updateService(index, "time", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location Name</Label>
              <Input
                name="location"
                placeholder="e.g., St. Mary's Church"
                value={service.location || ""}
                onChange={(e) =>
                  updateService(index, "location", e.target.value)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                name="address"
                placeholder="Full address"
                value={service.address || ""}
                onChange={(e) =>
                  updateService(index, "address", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="officiant">Officiant</Label>
              <Input
                name="officiant"
                placeholder="e.g., Pastor John Smith"
                value={service.officiant || ""}
                onChange={(e) =>
                  updateService(index, "officiant", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);
