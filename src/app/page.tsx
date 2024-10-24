"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FormData = {
  desiredProtein: string;
  desiredCarbs: string;
  desiredFats: string;
  desiredVitaminC: string;
  desiredCalcium: string;
  budget: string;
};

type ApiResponse = {
  usedIngredients: Array<{
    name: string;
    quantity: string;
  }>;
  totalCost: string;
};

type ApiError = {
  error: string;
};

type Ingredient = {
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  price: number;
  micros: {
    vitaminC: number;
    calcium: number;
  };
};

const ingredients: Ingredient[] = [
  {
    name: "Chicken Breast",
    protein: 31,
    carbs: 0,
    fat: 3.6,
    price: 5,
    micros: { vitaminC: 0, calcium: 0 },
  },
  {
    name: "Broccoli",
    protein: 2.8,
    carbs: 7,
    fat: 0.3,
    price: 2,
    micros: { vitaminC: 89.2, calcium: 47 },
  },
  {
    name: "Almonds",
    protein: 21,
    carbs: 22,
    fat: 50,
    price: 10,
    micros: { vitaminC: 0, calcium: 264 },
  },
  {
    name: "Oats",
    protein: 13,
    carbs: 68,
    fat: 6,
    price: 1.5,
    micros: { vitaminC: 0, calcium: 54 },
  },
  {
    name: "Salmon",
    protein: 25,
    carbs: 0,
    fat: 13,
    price: 8,
    micros: { vitaminC: 0, calcium: 9 },
  },
  {
    name: "Egg",
    protein: 13,
    carbs: 1.1,
    fat: 10,
    price: 3,
    micros: { vitaminC: 0, calcium: 56 },
  },
  {
    name: "Spinach",
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    price: 2,
    micros: { vitaminC: 28, calcium: 99 },
  },
  {
    name: "Quinoa",
    protein: 14,
    carbs: 64,
    fat: 6,
    price: 4,
    micros: { vitaminC: 0, calcium: 47 },
  },
  {
    name: "Greek Yogurt",
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    price: 4,
    micros: { vitaminC: 0, calcium: 110 },
  },
  {
    name: "Tofu",
    protein: 8,
    carbs: 2,
    fat: 4.8,
    price: 2.5,
    micros: { vitaminC: 0, calcium: 350 },
  },
  {
    name: "Avocado",
    protein: 2,
    carbs: 9,
    fat: 15,
    price: 3.5,
    micros: { vitaminC: 10, calcium: 12 },
  },
  {
    name: "Sweet Potato",
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    price: 1.8,
    micros: { vitaminC: 2.4, calcium: 30 },
  },
  {
    name: "Lentils",
    protein: 9,
    carbs: 20,
    fat: 0.4,
    price: 1.2,
    micros: { vitaminC: 0, calcium: 19 },
  },
  {
    name: "Cheddar Cheese",
    protein: 25,
    carbs: 1.3,
    fat: 33,
    price: 6,
    micros: { vitaminC: 0, calcium: 721 },
  },
];

interface OptimizerFormProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  errors: Partial<FormData>;
  formData: FormData;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function OptimizerForm({
  onSubmit,
  isLoading,
  errors,
  formData,
  handleChange,
}: OptimizerFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>
              {`${
                key.charAt(0).toUpperCase() +
                key.slice(1).replace("desired", "")
              } ${
                key.includes("budget")
                  ? "($)"
                  : key.includes("VitaminC") || key.includes("Calcium")
                  ? "(mg)"
                  : "(g)"
              }`}
            </Label>
            <Input
              id={key}
              type="number"
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={`Enter ${key.replace("desired", "").toLowerCase()}`}
            />
            {errors[key as keyof FormData] && (
              <p className="text-red-500 text-sm">
                {errors[key as keyof FormData]}
              </p>
            )}
          </div>
        ))}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Optimizing...
          </>
        ) : (
          "Optimize"
        )}
      </Button>
    </form>
  );
}

function IngredientsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Protein (g)</TableHead>
          <TableHead>Carbs (g)</TableHead>
          <TableHead>Fat (g)</TableHead>
          <TableHead>Vitamin C (mg)</TableHead>
          <TableHead>Calcium (mg)</TableHead>
          <TableHead>Price ($)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ingredients.map((ingredient) => (
          <TableRow key={ingredient.name}>
            <TableCell>{ingredient.name}</TableCell>
            <TableCell>{ingredient.protein}</TableCell>
            <TableCell>{ingredient.carbs}</TableCell>
            <TableCell>{ingredient.fat}</TableCell>
            <TableCell>{ingredient.micros.vitaminC}</TableCell>
            <TableCell>{ingredient.micros.calcium}</TableCell>
            <TableCell>{ingredient.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    desiredProtein: "",
    desiredCarbs: "",
    desiredFats: "",
    desiredVitaminC: "",
    desiredCalcium: "",
    budget: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validateForm = (): boolean => {
    let valid = true;
    const newErrors: Partial<FormData> = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (parseFloat(value) <= 0) {
        newErrors[key as keyof FormData] = `${
          key.charAt(0).toUpperCase() + key.slice(1).replace("desired", "")
        } must be greater than 0`;
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Invalid input",
        description: "Please fill in all the fields correctly.",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [
              key,
              parseFloat(value),
            ])
          )
        ),
      });

      if (!res.ok) {
        const errorData: ApiError = await res.json();
        throw new Error(
          errorData.error || "Failed to fetch optimization results"
        );
      }

      const data: ApiResponse = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Ingredient Optimizer</CardTitle>
          <CardDescription>
            Optimize your ingredients based on desired macronutrients,
            micronutrients, and budget.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="optimizer" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="optimizer">Optimizer</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            </TabsList>
            <TabsContent value="optimizer">
              <OptimizerForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                errors={errors}
                formData={formData}
                handleChange={handleChange}
              />
              {result && (
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-2">
                    Optimized Ingredients:
                  </h2>
                  <ul className="space-y-2">
                    {result.usedIngredients.map((item, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span>{item.name}</span>
                        <span className="font-medium">
                          {item.quantity} grams
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 text-right">
                    <span className="text-lg font-semibold">
                      Total Cost: ${result.totalCost}
                    </span>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="ingredients">
              <IngredientsTable />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
