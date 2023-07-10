import { DOWN_VOTE } from "../WhatsNext/constants";
import { UP_VOTE } from "./constants";

export interface DetailedFaq {
  FaqId: string;
  Query: string;
  Answer: string;
  SectionId: string;
  CategoryId: string;
}

export interface FAQSection {
  FaqId: string;
  Query: string;
  Answer: string;
  SectionId: string;
  CategoryId: string;
}

export interface FAQData {
  CategoryId: string;
  CategoryName: string;
  CategoryDescription: string;
  Sections?: SectionData[];
  Faqs?: FAQSection[];
}

export interface FaqSearchResponse {
  CategoryId: string;
  CategoryName: string;
  CategoryDescription: string;
  Sections: SectionData[];
  Faqs?: FAQSection[];
}
export interface SectionData {
  SectionId: string;
  SectionName: string;
  SectionDescription: string;
  CategoryId: string;
  SectionFaqs: FAQSection[];
}

export interface FAQListItem {
  FaqId: string;
  Query: string;
  Answer: string;
  SectionId: string;
  CategoryId: string;
}

export interface DetailsFAQResponse {
  FaqId: string;
  Query: string;
  Answer: string;
  SectionId: string;
  CategoryId: string;
  RelatedFaqs?: FAQListItem[];
  Feedback: {
    ContentId?: string;
    CustomerId?: string;
    UpdatedOn?: string;
    VoteDescription?: string;
    VoteId?: typeof UP_VOTE | typeof DOWN_VOTE;
  };
}
