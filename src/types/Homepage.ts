import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";

type CustomerConfigurationType = { IsVisible: boolean; SectionIndex: number };

export enum WidgetTypesEnum {
  APPRECIATIONS = "Appreciations",
  ARTICLES = "What’s Next",
  INVITE_FRIEND = "Invite a friend",
  GOAL_GETTER = "Your Goals",
  MONEY_SPEND = "Money Spend",
  GOLD_WALLET = "Gold Wallet",
}

export interface HomepageItemLayoutType {
  Name: string;
  Description: string;
  CustomerConfiguration: CustomerConfigurationType;
}

export interface QuickActionType {
  Id: string;
  Name: string;
  "Shortcut Icon": string;
  Description: string;
  Link: {
    screen: string;
    stack: keyof AuthenticatedStackParams;
  };
  CustomerConfiguration: CustomerConfigurationType;
}

export interface HomePageConfigurationResponse {
  Homepage: {
    Sections: {
      Shortcuts: QuickActionType[];
      HeroFeatures: [];
      Sections: HomepageItemLayoutType[];
    };
  };
}

export interface PostHomePageConfigurations {
  Homepage: {
    Shortcuts: QuickActionType[];
    HeroFeatures: [];
    Sections: HomepageItemLayoutType[];
  };
}
