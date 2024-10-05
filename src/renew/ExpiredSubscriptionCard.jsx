import { AlertTriangle, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const ExpiredSubscriptionCard = () => {
  const { t } = useTranslation("global");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md mx-auto border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-amber-500 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            {t("common.subscription.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {t("common.subscription.desc")}
          </p>
          <div className="space-y-2">
            <h3 className="font-semibold">
              {t("common.subscription.benefits.title")}
            </h3>
            <ul className="space-y-1">
              {[
                t("common.subscription.benefits.keepUp"),
                t("common.subscription.benefits.attractMore"),
                t("common.subscription.benefits.efficiency"),
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
            {t("common.subscription.thankYou")}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExpiredSubscriptionCard;
