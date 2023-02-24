interface DetailedFaq {
  faq_id: string;
  query: string;
  answer: string;
}

interface SubSections {
  sub_section_id: string;
  sub_section_name: string;
  sub_section_description: string;
  sub_section_faqs: DetailedFaq[];
}

interface Section {
  section_id: string;
  section_name: string;
  section_description: string;
  section_faqs: DetailedFaq[];
  sub_sections: SubSections[];
}

interface Categories {
  category_id: string;
  category_name: string;
  category_description: string;
  category_faqs: DetailedFaq[];
  sections: Section[];
}

export interface FAQData {
  categories: Categories[];
}
