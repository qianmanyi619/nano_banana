"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image, MessageSquare, Zap, Upload } from "lucide-react";

interface GeneratedImage {
  id: string;
  url: string;
  timestamp: number;
}

export default function ImageEditor() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt.trim()) return;

    setIsGenerating(true);
    try {
      const base64Image = await convertImageToBase64(selectedImage);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          prompt: prompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: data.imageUrl,
        timestamp: Date.now(),
      };

      setGeneratedImages(prev => [newImage, ...prev]);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Prompt Engine */}
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-orange-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Image className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Prompt Engine</h3>
            <p className="text-gray-600">Transform your image with AI-powered editing</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
              <Image className="w-4 h-4 mr-2" />
              Image to Image
            </Button>
            <Button size="sm" variant="outline" disabled>
              Text to Image
            </Button>
          </div>

          <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-yellow-800">Batch Processing</span>
              <Badge className="bg-yellow-200 text-yellow-800 text-xs">Pro</Badge>
            </div>
            <p className="text-xs text-yellow-700">Enable batch mode to process multiple images at once</p>
          </div>

          {/* Image Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-orange-300 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <div className="space-y-2">
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <p className="text-sm text-gray-600">Click to change image</p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Add Image</p>
                <p className="text-xs text-gray-500">Max 50MB</p>
              </>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-1" />
              Main Prompt
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
              rows={3}
              placeholder="A futuristic city powered by nano technology, golden hour lighting, ultra detailed..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!selectedImage || !prompt.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium py-3"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate Now"}
          </Button>
        </div>
      </Card>

      {/* Output Gallery */}
      <Card className="p-6 bg-white border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
            <Image className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Output Gallery</h3>
            <p className="text-gray-600">Your ultra-fast AI creations appear here instantly</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 min-h-[300px]">
          {generatedImages.length > 0 ? (
            <div className="grid gap-4">
              {generatedImages.map((image) => (
                <div key={image.id} className="bg-white rounded-lg p-3 shadow-sm">
                  <img
                    src={image.url}
                    alt="Generated"
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <p className="text-xs text-gray-500">
                    Generated at {new Date(image.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Image className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Ready for instant generation</h4>
              <p className="text-gray-600">Upload an image and enter your prompt to unleash the power</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}