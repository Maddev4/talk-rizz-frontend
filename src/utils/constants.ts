export const CATEGORIES_CARD_DESCRIPTION = {
    Entertainment:
      'Explore unique ideas, and content recommendations to make your leisure time more enjoyable.',
    Businesses:
      'Optimize your workflow with suggestions for decision-making, project management, and client interactions to boost your professional efficiency.',
    Developers:
      'Engage in coding solutions, algorithm discussions, and development tasks.',
    Researchers:
      'Stay updated on the latest AI research, algorithms, and data analysis techniques to fuel your curiosity and knowledge in the field.',
    'Content Creators':
      'Unleash your creativity with AI-powered tools for content generation, editing, and optimization across various digital platforms.',
    Education:
      'Access AI-powered educational resources, personalized learning experiences, and study aids to enhance your academic journey.',
    Healthcare:
      'Ask health-related questions or how to speak with patients and learn about advancements in the medical field.',
    Legal:
      'Navigate the legal landscape with AI assistance, covering document review, contract analysis, and legal research.',
    'Customer Service':
      'Experience seamless customer support with AI-driven chatbots and virtual assistants designed to enhance your service interactions. Create customer service scripts and learn how to assist customers in the best way for your business.',
    Gaming:
      'Immerse yourself in the world of gaming with discussions and ideas on character behavior, procedural content generation, story creation, and adaptive difficulty systems.',
    Students:
      'Access AI-powered study tools, educational content, and resources tailored to support your learning journey. Ask for help on assignments and educational topics that you need assistance learning.',
    Writers:
      'Elevate your writing experience with AI tools that assist in brainstorming, editing, and generating creative content.',
    Therapy:
      'Explore a space of AI virtual therapy tools, mood tracking, and emotional well-being support. Ask for advice and get help from an AI therapist without judgment.',
    Dating:
      'Navigate the world of online dating with AI-powered matchmaking algorithms and relationship advice tailored for your needs. Ask for pick up lines and new date ideas.',
    Relationships:
      'Enhance your relationships with AI-driven communication tools and personalized recommendations for couples to strengthen your connections.',
  } as const;
  
export const MESSAGE_TYPE = {
  Human: 'user',
  AIAssistant: 'assistant'
}

export const CHAT_TYPE = {
  Text: "Text",
  Web: "Web",
  Youtube: "Youtube",
  Image: "Image",
  Doc: "Doc",
};

export const BUCKET_NAME = "askaibucket";
export const REGION_NAME = "us-east-2";
export const limitMessageCount = 10;
export const reviewMessageCount = 4;