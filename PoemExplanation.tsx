import React from 'react';
import { BookOpen, X, Lightbulb, Heart, Palette, History } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

type Language = 'urdu' | 'hindi' | 'english';

interface Poem {
  id: string;
  urdu: string;
  hindi: string;
  english: string;
  author: {
    urdu: string;
    hindi: string;
    english: string;
  };
  category?: string;
  metadata?: {
    theme?: string;
    difficulty?: string;
    [key: string]: any;
  };
}

interface PoemExplanationProps {
  poem: Poem;
  language: Language;
  isOpen: boolean;
  onClose: () => void;
}

export function PoemExplanation({ poem, language, isOpen, onClose }: PoemExplanationProps) {
  if (!isOpen) return null;

  // Generate explanation content based on language and poem
  const getExplanation = () => {
    const explanations = {
      urdu: {
        meaning: {
          title: "شاعری کا مطلب",
          content: `یہ شعر ${poem.author.urdu} کی گہری سوچ کا عکاس ہے۔ اس میں ${poem.metadata?.theme || 'زندگی'} کے موضوع پر بات کی گئی ہے۔ شاعر نے انسانی جذبات اور تجربات کو بہت خوبصورتی سے بیان کیا ہے۔ یہ شعر ہمیں زندگی کی گہری حقیقتوں سے آگاہ کرتا ہے۔`
        },
        literary: {
          title: "ادبی تجزیہ",
          content: `اس شعر میں استعمال ہونے والے الفاظ اور تصویری زبان قاری کے دل پر گہرا اثر ڈالتے ہیں۔ شاعر نے استعاروں اور تشبیہات کا بہترین استعمال کیا ہے۔ یہ ${poem.category || 'کلاسیکی'} شاعری کی روایت کو برقرار رکھتے ہوئے جدید احساسات کو بیان کرتا ہے۔`
        },
        context: {
          title: "تاریخی پس منظر",
          content: `${poem.author.urdu} کے دور میں یہ موضوع بہت اہم تھا۔ اس وقت کے سماجی اور سیاسی حالات کا یہ شعر پر گہرا اثر ہے۔ یہ شعر اردو ادب میں اپنا منفرد مقام رکھتا ہے۔`
        },
        emotion: {
          title: "جذباتی اثرات",
          content: `یہ شعر پڑھنے والے کے دل میں امید، محبت اور تسکین کے جذبات پیدا کرتا ہے۔ اس کے الفاظ دل کی گہرائیوں تک پہنچتے ہیں اور قاری کو اپنی زندگی کے بارے میں سوچنے پر مجبور کرتے ہیں۔`
        }
      },
      hindi: {
        meaning: {
          title: "कविता का अर्थ",
          content: `यह कविता ${poem.author.hindi} के गहरे विचारों को दर्शाती है। इसमें ${poem.metadata?.theme || 'जीवन'} के विषय पर चर्चा की गई है। कवि ने मानवीय भावनाओं और अनुभवों को बहुत सुंदरता से व्यक्त किया है। यह कविता हमें जीवन की गहरी सच्चाइयों से अवगत कराती है।`
        },
        literary: {
          title: "साहित्यिक विश्लेषण",
          content: `इस कविता में प्रयुक्त शब्द और बिंबात्मक भाषा पाठक के हृदय पर गहरा प्रभाव डालते हैं। कवि ने रूपकों और उपमाओं का बेहतरीन प्रयोग किया है। यह ${poem.category || 'क्लासिकल'} कविता की परंपरा को बनाए रखते हुए आधुनिक भावनाओं को व्यक्त करती है।`
        },
        context: {
          title: "ऐतिहासिक पृष्ठभूमि",
          content: `${poem.author.hindi} के समय में यह विषय बहुत महत्वपूर्ण था। उस समय की सामाजिक और राजनीतिक परिस्थितियों का इस कविता पर गहरा प्रभाव है। यह कविता हिंदी साहित्य में अपना विशिष्ट स्थान रखती है।`
        },
        emotion: {
          title: "भावनात्मक प्रभाव",
          content: `यह कविता पढ़ने वाले के मन में आशा, प्रेम और शांति के भाव उत्पन्न करती है। इसके शब्द दिल की गहराइयों तक पहुंचते हैं और पाठक को अपने जीवन के बारे में सोचने पर विवश करते हैं।`
        }
      },
      english: {
        meaning: {
          title: "Meaning of the Poem",
          content: `This poem reflects the profound thoughts of ${poem.author.english}. It explores the theme of ${poem.metadata?.theme || 'life'} with remarkable depth. The poet has beautifully expressed human emotions and experiences through carefully chosen words. This poem enlightens us about the deeper truths of existence and invites contemplation.`
        },
        literary: {
          title: "Literary Analysis",
          content: `The imagery and metaphorical language used in this poem create a powerful impact on the reader. The poet employs skillful use of symbolism and poetic devices. This represents the ${poem.category || 'classical'} tradition of poetry while expressing contemporary emotions and universal themes.`
        },
        context: {
          title: "Historical Context",
          content: `During ${poem.author.english}'s era, this theme held particular significance. The social and cultural circumstances of the time deeply influenced this work. This poem holds a distinguished place in the literary canon and continues to resonate with modern readers.`
        },
        emotion: {
          title: "Emotional Impact",
          content: `This poem evokes feelings of hope, love, and tranquility in the reader's heart. The words penetrate deep into one's soul and compel the reader to reflect on their own life journey. It offers comfort and inspiration to those who engage with its message.`
        }
      }
    };

    return explanations[language];
  };

  const explanation = getExplanation();

  const getLanguageDirection = () => {
    return language === 'urdu' ? 'rtl' : 'ltr';
  };

  const getLanguageAlign = () => {
    return language === 'urdu' ? 'text-right' : 'text-left';
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-deep/10 rounded-full">
              <BookOpen size={20} className="text-emerald-deep" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-text-primary">
                {language === 'urdu' ? 'شاعری کی تشریح' : 
                 language === 'hindi' ? 'कविता की व्याख्या' : 
                 'Poem Analysis'}
              </h2>
              <p className="text-sm text-text-secondary">
                {language === 'urdu' ? `بذریعہ ${poem.author.urdu}` :
                 language === 'hindi' ? `द्वारा ${poem.author.hindi}` :
                 `by ${poem.author.english}`}
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            size="sm"
            variant="outline"
            className="rounded-full w-8 h-8 p-0"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]" dir={getLanguageDirection()}>
          <div className="space-y-6">
            {/* Poem Context */}
            <div className="text-center space-y-2">
              <div className="text-xs text-gold-accent uppercase tracking-wide">
                {language === 'urdu' ? 'موضوع' : 
                 language === 'hindi' ? 'विषय' : 
                 'Theme'}: {poem.metadata?.theme || 'Life'}
              </div>
              <div className="text-xs text-text-secondary">
                {language === 'urdu' ? 'قسم' : 
                 language === 'hindi' ? 'श्रेणी' : 
                 'Category'}: {poem.category || 'Classical'}
              </div>
            </div>

            <Separator />

            {/* Meaning */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb size={18} className="text-gold-accent" />
                <h3 className={`font-medium text-text-primary ${getLanguageAlign()}`}>
                  {explanation.meaning.title}
                </h3>
              </div>
              <p className={`text-sm text-text-secondary leading-relaxed ${getLanguageAlign()}`}>
                {explanation.meaning.content}
              </p>
            </Card>

            {/* Literary Analysis */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Palette size={18} className="text-emerald-deep" />
                <h3 className={`font-medium text-text-primary ${getLanguageAlign()}`}>
                  {explanation.literary.title}
                </h3>
              </div>
              <p className={`text-sm text-text-secondary leading-relaxed ${getLanguageAlign()}`}>
                {explanation.literary.content}
              </p>
            </Card>

            {/* Historical Context */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <History size={18} className="text-midnight-blue" />
                <h3 className={`font-medium text-text-primary ${getLanguageAlign()}`}>
                  {explanation.context.title}
                </h3>
              </div>
              <p className={`text-sm text-text-secondary leading-relaxed ${getLanguageAlign()}`}>
                {explanation.context.content}
              </p>
            </Card>

            {/* Emotional Impact */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Heart size={18} className="text-red-500" />
                <h3 className={`font-medium text-text-primary ${getLanguageAlign()}`}>
                  {explanation.emotion.title}
                </h3>
              </div>
              <p className={`text-sm text-text-secondary leading-relaxed ${getLanguageAlign()}`}>
                {explanation.emotion.content}
              </p>
            </Card>

            {/* Call to Action */}
            <div className="text-center pt-4">
              <p className="text-xs text-text-secondary opacity-75">
                {language === 'urdu' ? 'یہ تجزیہ آپ کو شاعری کی گہرائی میں جانے میں مدد کرتا ہے' :
                 language === 'hindi' ? 'यह विश्लेषण आपको कविता की गहराई में जाने में मदद करता है' :
                 'This analysis helps you delve deeper into the poetry\'s essence'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-center">
            <Button
              onClick={onClose}
              className="bg-emerald-deep hover:bg-emerald-deep/90 text-white px-6"
            >
              {language === 'urdu' ? 'بند کریں' :
               language === 'hindi' ? 'बंद करें' :
               'Close'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}