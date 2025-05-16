import React, { useState } from "react";
import { IonList, IonItem, IonLabel, IonButton, IonIcon } from "@ionic/react";
import { chevronDown, chevronUp } from "ionicons/icons";
import { useAuth } from "../../contexts/AuthContext";
import { getPlatforms } from "@ionic/react";

import "./CategoryMenu.css";
interface CategoryMenuProps {
  onSelectSubcategory: (
    category: string,
    subcategory: { key: string; title: string }
  ) => void;
}

type Categories = {
  [key: string]: { key: string; title: string }[];
};

console.log("platform", getPlatforms());

const CategoryMenu: React.FC<CategoryMenuProps> = ({ onSelectSubcategory }) => {
  const { profile } = useAuth();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories: Categories = {
    [`${profile?.basicProfile?.name}'s exclusive assistant` ||
    "User Assistant"]: [],
    "surprise me!": [],
    friendship: [],
    professional: [],
    dating: [
      { key: "lifePartner", title: "Life partner" },
      { key: "longTerm", title: "Long-term" },
      { key: "shortTerm", title: "Short-term" },
      { key: "hookUp", title: "Hook-up" },
    ],
  };

  const handleCategoryClick = (category: string) => {
    if (categories[category].length === 0) {
      // If no subcategories, select the category directly
      onSelectSubcategory(category, { key: "", title: "" });
      return;
    }
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const handleSubcategoryClick = (
    category: string,
    subcategory: { key: string; title: string }
  ) => {
    onSelectSubcategory(category, subcategory);
  };

  return (
    <IonList className="category-menu">
      {Object.entries(categories).map(([category, subcategories]) => (
        <div key={category}>
          <IonItem
            button
            onClick={() => handleCategoryClick(category)}
            className="category-item"
          >
            <IonLabel>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </IonLabel>
            {subcategories.length > 0 && !getPlatforms().includes("ios") && (
              <IonIcon
                icon={expandedCategory === category ? chevronUp : chevronDown}
              />
            )}
          </IonItem>

          {expandedCategory === category && subcategories.length > 0 && (
            <div className="subcategory-list">
              {subcategories.map((subcategory) => (
                <IonItem
                  key={subcategory.key}
                  button
                  onClick={() => handleSubcategoryClick(category, subcategory)}
                  className="subcategory-item"
                >
                  <IonLabel>{subcategory.title}</IonLabel>
                </IonItem>
              ))}
            </div>
          )}
        </div>
      ))}
    </IonList>
  );
};

export default CategoryMenu;
