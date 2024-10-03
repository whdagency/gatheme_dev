import { AlertTriangle, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ExpiredSubscriptionCard = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md mx-auto border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-amber-500 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            Subscription Expired
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We apologize for the interruption. Your digital menu subscription
            has expired.
          </p>
          <div className="space-y-2">
            <h3 className="font-semibold">Benefits of Renewing:</h3>
            <ul className="space-y-1">
              {[
                "Keep your menu up-to-date",
                "Attract more customers",
                "Increase efficiency",
              ].map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-sm text-center">
            Thank you for being a valued customer. We look forward to continuing
            to serve you!
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExpiredSubscriptionCard;
