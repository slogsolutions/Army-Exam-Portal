import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Camera, 
  Upload, 
  Save, 
  UserPlus,
  FileText,
  Calendar,
  MapPin
} from "lucide-react";
import { registerCandidate } from "@/lib/api";

export const CandidateRegistration = () => {
  const [formData, setFormData] = useState({
    armyNo: '',
    rank: '',
    name: '',
    trade: '',
    dob: '',
    fatherName: '',
    enrollmentNo: '',
    doe: '',
    aadhar: '',
    unit: '',
    brigade: '',
    division: '',
    corps: '',
    command: '',
    trainingCenter: '',
    district: '',
    state: '',
    qualification: '',
    level: '',
    nsqfLevel: '',
    examCategory: ''
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  async function handleSave() {
    try {
      setSaving(true);
      await registerCandidate({
        name: formData.name,
        army_number: formData.armyNo,
      });
      alert("Candidate saved");
    } catch (e) {
      alert("Failed to save candidate");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Candidate Registration</h2>
          <p className="text-muted-foreground">Register new candidates for examination</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Registration Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="armyNo">Army Number *</Label>
                  <Input
                    id="armyNo"
                    value={formData.armyNo}
                    onChange={(e) => handleInputChange('armyNo', e.target.value)}
                    placeholder="Enter Army Number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rank">Rank *</Label>
                  <Select value={formData.rank} onValueChange={(value) => handleInputChange('rank', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Rank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sepoy">Sepoy</SelectItem>
                      <SelectItem value="naik">Naik</SelectItem>
                      <SelectItem value="havildar">Havildar</SelectItem>
                      <SelectItem value="sergeant">Sergeant</SelectItem>
                      <SelectItem value="jco">JCO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter Full Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's Name *</Label>
                  <Input
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                    placeholder="Enter Father's Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aadhar">Aadhar Number</Label>
                  <Input
                    id="aadhar"
                    value={formData.aadhar}
                    onChange={(e) => handleInputChange('aadhar', e.target.value)}
                    placeholder="Enter Aadhar Number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Service Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trade">Trade *</Label>
                  <Select value={formData.trade} onValueChange={(value) => handleInputChange('trade', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Trade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="medical">Medical</SelectItem>
                      <SelectItem value="logistics">Logistics</SelectItem>
                      <SelectItem value="communication">Communication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrollmentNo">Enrollment Number</Label>
                  <Input
                    id="enrollmentNo"
                    value={formData.enrollmentNo}
                    onChange={(e) => handleInputChange('enrollmentNo', e.target.value)}
                    placeholder="Enter Enrollment Number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doe">Date of Enrollment</Label>
                  <Input
                    id="doe"
                    type="date"
                    value={formData.doe}
                    onChange={(e) => handleInputChange('doe', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit *</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    placeholder="Enter Unit"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formation Details */}
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Formation & Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brigade">Brigade</Label>
                  <Input
                    id="brigade"
                    value={formData.brigade}
                    onChange={(e) => handleInputChange('brigade', e.target.value)}
                    placeholder="Enter Brigade"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="division">Division</Label>
                  <Input
                    id="division"
                    value={formData.division}
                    onChange={(e) => handleInputChange('division', e.target.value)}
                    placeholder="Enter Division"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="corps">Corps</Label>
                  <Input
                    id="corps"
                    value={formData.corps}
                    onChange={(e) => handleInputChange('corps', e.target.value)}
                    placeholder="Enter Corps"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="command">Command</Label>
                  <Input
                    id="command"
                    value={formData.command}
                    onChange={(e) => handleInputChange('command', e.target.value)}
                    placeholder="Enter Command"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Enter State"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    placeholder="Enter District"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Photo & Additional Info */}
        <div className="space-y-6">
          {/* Photograph Upload */}
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Photograph</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Upload candidate photograph
                </p>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Accepted formats: JPG, PNG. Max size: 2MB
              </p>
            </CardContent>
          </Card>

          {/* Qualification Details */}
          <Card className="shadow-soft border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Qualification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification Name</Label>
                <Input
                  id="qualification"
                  value={formData.qualification}
                  onChange={(e) => handleInputChange('qualification', e.target.value)}
                  placeholder="Enter Qualification"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="examCategory">Exam Category</Label>
                <Select value={formData.examCategory} onValueChange={(value) => handleInputChange('examCategory', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical-l3">Technical Level 3</SelectItem>
                    <SelectItem value="skill-comp-l2">Skill Competency Level 2</SelectItem>
                    <SelectItem value="advanced-tech">Advanced Technical</SelectItem>
                    <SelectItem value="basic-comp">Basic Competency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full" size="lg" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Candidate"}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setFormData({
              armyNo: '', rank: '', name: '', trade: '', dob: '', fatherName: '', enrollmentNo: '', doe: '', aadhar: '', unit: '', brigade: '', division: '', corps: '', command: '', trainingCenter: '', district: '', state: '', qualification: '', level: '', nsqfLevel: '', examCategory: ''
            })}>
              Reset Form
            </Button>
          </div>

          {/* Status Info */}
          <Card className="bg-accent/50 border-accent">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Registration Status</h4>
                <div className="space-y-1">
                  <Badge variant="success" className="text-xs">Database Connected</Badge>
                  <Badge variant="outline" className="text-xs">Auto-save Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};