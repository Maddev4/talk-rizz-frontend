export interface Connect {
  random: {
    [key: string]: any;
  };
  friendship: {
    [key: string]: any;
  };
  professional: {
    [key: string]: any;
  };
  dating: {
    lifePartner: {
      imLookingFor: string;
      mustHave: { name: string; value: number }[];
      dealBreakers: { name: string; value: number }[];
    };
    longTerm: {
      [key: string]: any;
    };
    shortTerm: {
      [key: string]: any;
    };
    hookUp: {
      [key: string]: any;
    };
  };
  surpriseMe: {
    [key: string]: any;
  };
}
