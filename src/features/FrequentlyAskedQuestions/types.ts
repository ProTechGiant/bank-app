export interface DetailedFaq {
  faq_id: string;
  query: string;
  answer: string;
}

interface FAQSubSection {
  sub_section_id: string;
  sub_section_name: string;
  sub_section_description: string;
  sub_section_faqs: DetailedFaq[];
}

export interface FAQSection {
  section_id: string;
  section_name: string;
  section_description: string;
  section_faqs: DetailedFaq[];
  sub_sections: FAQSubSection[];
}

export interface FAQCategory {
  category_id: string;
  category_name: string;
  category_description: string;
  category_faqs: DetailedFaq[];
  sections: FAQSection[];
}

//TODO: Remove when mock data is removed, this is only needed for mock data.
export interface FAQData {
  categories: FAQCategory[];
}
