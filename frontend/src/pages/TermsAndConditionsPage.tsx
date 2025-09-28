import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const TermsAndConditionsPage: React.FC = () => {
  // Set Hindi as the default language based on the explicit prompt
  const [language, setLanguage] = useState<'English' | 'Hindi'>('Hindi');
  
  const lastUpdated = "28 सितंबर, 2025"; 
  const projectName = "जैन हेरिटेज प्रोजेक्ट"; // Hindi Project Name
  const projectEntity = "जैन पांडुलिपि संरक्षण केंद्र"; // Hindi Entity Name
  const contactEmail = "info@jainheritageproject.org";

  const englishContent = {
    title: "TERMS OF USE",
    effectiveDateLabel: "Effective Date",
    contactLabel: "Contact and Notices",
  };

  const hindiContent = {
    title: "उपयोग की शर्तें",
    effectiveDateLabel: "प्रभावी तिथि",
    contactLabel: "संपर्क और सूचनाएँ",
  };

  const content = language === 'English' ? englishContent : hindiContent;
  
  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'English' ? 'Hindi' : 'English'));
  };

  // --- START OF BILINGUAL CONTENT DEFINITIONS ---

  // English content definition
  const sectionsEnglish = [
    {
      title: "1. Acceptance of Terms",
      content: (
        <>
          This agreement sets forth the legally binding terms and conditions for your use of the **Jain Heritage Project** website, owned and operated by the **Jain Manuscript Preservation Center** ("the Project"). By accessing or using the Service, you signify that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree to the terms herein, you must cease using the Service immediately.
        </>
      ),
    },
    {
      title: "2. Intellectual Property and Limited License",
      content: (
        <>
          {/* Text change: removed specific mention of manuscripts/images */}
          All **digital assets, data, and content** hosted on this Service are the exclusive property of the Project or its licensors and are protected under international copyright and intellectual property laws.
          
          <h4 className="font-semibold text-base mt-4 mb-2 text-foreground">2.1. Digital Asset Usage Restriction</h4>
          <p className="text-base text-foreground/80 leading-relaxed mb-2">
            The **digital assets** and source material are licensed **only for non-commercial, personal, and scholarly viewing and research within the confines of the Jain Heritage Project platform**. 
          </p>
          <p className="text-base text-foreground/80 leading-relaxed">
            **Prohibition on External Use:** The content, digital assets, and their underlying data **may not be copied, reproduced, distributed, displayed, or utilized outside of this website environment**, including for commercial purposes, publishing, or integration into external databases, without the express written permission of the Jain Manuscript Preservation Center.
          </p>

          <h4 className="font-semibold text-base mt-4 mb-2 text-foreground">2.2. User Submissions and Research Property</h4>
          <p className="text-base text-foreground/80">
            Any original research findings, annotations, comments, or data you submit to the Service that directly relates to or annotates the source material become the **exclusive property of the Project** (or the original owner) upon submission. You grant the Project a perpetual, irrevocable, worldwide, royalty-free license to use, reproduce, modify, and display all such contributions in connection with the Service.
          </p>

          <h4 className="font-semibold text-base mt-4 mb-2 text-foreground">2.3. Attribution Requirements</h4>
          <p className="text-base text-foreground/80">
            Any limited use of the materials authorized in writing by the Project must include clear and conspicuous credit to **"Jain Heritage Project"** and the original source/owner of the content.
          </p>
        </>
      ),
    },
    {
      title: "3. User Responsibilities and Conduct",
      content: (
        <>
          You are responsible for all activity under your account and agree to use the Service only for lawful purposes. You shall not:
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-sm text-foreground/80">
            <li>Attempt to interfere with the proper working of the Service or its security features.</li>
            <li>Upload or transmit any malicious code, offensive, defamatory, or copyrighted material without authorization.</li>
            <li>Attempt to scrape, collect, or harvest data, metadata, or user information from the Service.</li>
          </ul>
        </>
      ),
    },
    {
      title: "4. Disclaimer of Warranties",
      content: (
        <>
          The Service and all materials contained therein are provided on an **"as is"** and **"as available"** basis, without any warranties of any kind, either express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, or non-infringement. The Project does not warrant that the Service will be uninterrupted, error-free, or completely secure.
        </>
      ),
    },
    {
      title: "5. Governing Law and Jurisdiction",
      content: (
        <>
          These Terms shall be governed and construed in accordance with the laws of **India**, without regard to its conflict of law provisions. You agree to submit to the personal and exclusive jurisdiction of the courts located within **Pune, Maharashtra, India**, to resolve any legal matter arising from these Terms.
        </>
      ),
    },
  ];

  // Hindi content definition
  const sectionsHindi = [
    {
      title: "1. शर्तों की स्वीकृति",
      content: (
        <>
          यह अनुबंध **{projectEntity}** ("परियोजना") के स्वामित्व और संचालन वाली **{projectName}** वेबसाइट के आपके उपयोग के लिए कानूनी रूप से बाध्यकारी नियम और शर्तें निर्धारित करता है। सेवा तक पहुँचने या उसका उपयोग करके, आप दर्शाते हैं कि आपने इन उपयोग की शर्तों को पढ़ लिया है, समझ लिया है और इनसे बाध्य होने के लिए सहमत हैं। यदि आप यहाँ दी गई शर्तों से सहमत नहीं हैं, तो आपको तुरंत सेवा का उपयोग बंद कर देना चाहिए।
        </>
      ),
    },
    {
      title: "2. बौद्धिक संपदा और सीमित लाइसेंस",
      content: (
        <>
          {/* Text change: removed specific mention of manuscripts/images */}
          इस सेवा पर होस्ट की गई सभी **डिजिटल संपत्ति, डेटा और सामग्री** परियोजना या उसके लाइसेंसदाताओं की अनन्य संपत्ति हैं और अंतर्राष्ट्रीय कॉपीराइट और बौद्धिक संपदा कानूनों के तहत संरक्षित हैं।
          
          <h4 className="font-semibold text-base mt-4 mb-2 text-foreground">2.1. डिजिटल संपत्ति उपयोग प्रतिबंध</h4>
          <p className="text-base text-foreground/80 leading-relaxed mb-2">
            **डिजिटल संपत्तियों** और स्रोत सामग्री का लाइसेंस **केवल {projectName} प्लेटफ़ॉर्म की सीमाओं के भीतर गैर-व्यावसायिक, व्यक्तिगत और विद्वानों द्वारा देखने और शोध के लिए** दिया गया है।
          </p>
          <p className="text-base text-foreground/80 leading-relaxed">
            **बाहरी उपयोग पर प्रतिबंध:** सामग्री, डिजिटल संपत्तियाँ और उनके अंतर्निहित डेटा को **इस वेबसाइट परिवेश के बाहर कॉपी, पुनरुत्पादित, वितरित, प्रदर्शित या उपयोग नहीं किया जा सकता है**, जिसमें व्यावसायिक उद्देश्यों, प्रकाशन या बाहरी डेटाबेस में एकीकरण के लिए, {projectEntity} की स्पष्ट लिखित अनुमति के बिना शामिल है।
          </p>

          <h4 className="font-semibold text-base mt-4 mb-2 text-foreground">2.2. उपयोगकर्ता प्रस्तुतियाँ और अनुसंधान संपत्ति</h4>
          <p className="text-base text-foreground/80">
            कोई भी मूल शोध निष्कर्ष, एनोटेशन (टिप्पणियाँ), टिप्पणियाँ, या डेटा जो आप सेवा को प्रस्तुत करते हैं और जो सीधे स्रोत सामग्री से संबंधित या उसे एनोटेट करता है, जमा करने पर **परियोजना की अनन्य संपत्ति** (या मूल स्वामी की संपत्ति) बन जाता है। आप ऐसी सभी प्रस्तुतियों का उपयोग, पुनरुत्पादन, संशोधन और प्रदर्शन करने के लिए परियोजना को शाश्वत, अपरिवर्तनीय, विश्वव्यापी, रॉयल्टी-मुक्त लाइसेंस प्रदान करते हैं।
          </p>
          
          <h4 className="font-semibold text-base mt-4 mb-2 text-foreground">2.3. श्रेय आवश्यकताएँ</h4>
          <p className="text-base text-foreground/80">
            परियोजना द्वारा लिखित रूप में अधिकृत सामग्री के किसी भी सीमित उपयोग में **"{projectName}"** और सामग्री के मूल स्रोत/स्वामी को स्पष्ट और सुस्पष्ट श्रेय शामिल होना चाहिए।
          </p>
        </>
      ),
    },
    {
      title: "3. उपयोगकर्ता की ज़िम्मेदारियाँ और आचरण",
      content: (
        <>
          आप अपने खाते के अंतर्गत सभी गतिविधियों के लिए ज़िम्मेदार हैं और सेवा का उपयोग केवल वैध उद्देश्यों के लिए करने के लिए सहमत हैं। आपको निम्न कार्य नहीं करने चाहिए:
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-sm text-foreground/80">
            <li>सेवा या उसकी सुरक्षा सुविधाओं के समुचित संचालन में हस्तक्षेप करने का प्रयास।</li>
            <li>बिना अनुमति के कोई भी दुर्भावनापूर्ण कोड, आपत्तिजनक, मानहानिकारक या कॉपीराइट वाली सामग्री अपलोड या प्रसारित करना।</li>
            <li>सेवा से डेटा, मेटाडेटा या उपयोगकर्ता जानकारी को स्क्रैप, एकत्रित या एकत्रित करने का प्रयास।</li>
          </ul>
        </>
      ),
    },
    {
      title: "4. वारंटी का अस्वीकरण",
      content: (
        <>
          सेवा और उसमें निहित सभी सामग्रियाँ **"जैसी है"** और **"जैसी उपलब्ध है"** के आधार पर प्रदान की जाती हैं, बिना किसी प्रकार की स्पष्ट या निहित वारंटी के, जिसमें व्यापारिकता, किसी विशेष उद्देश्य के लिए उपयुक्तता, या गैर-उल्लंघन की निहित वारंटी शामिल हैं, लेकिन इन्हीं तक सीमित नहीं हैं। परियोजना यह वारंटी नहीं देती है कि सेवा निर्बाध, त्रुटि-मुक्त, या पूरी तरह से सुरक्षित रहेगी।
        </>
      ),
    },
    {
      title: "5. शासन कानून और क्षेत्राधिकार",
      content: (
        <>
          ये शर्तें **भारत** के कानूनों के अनुसार शासित और व्याख्या की जाएँगी, इसके कानून के प्रावधानों के टकराव की परवाह किए बिना। आप इन शर्तों से उत्पन्न होने वाले किसी भी कानूनी मामले को हल करने के लिए **पुणे, महाराष्ट्र, भारत** में स्थित न्यायालयों के व्यक्तिगत और अनन्य क्षेत्राधिकार को स्वीकार करने के लिए सहमत हैं।
        </>
      ),
    },
  ];
  
  const currentSections = language === 'English' ? sectionsEnglish : sectionsHindi;

  return (
    <div className="min-h-screen pt-12 pb-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Header Section (Formal Framing) */}
        <header className="text-center mb-10">
          <div className="flex justify-between items-center mb-4">
            <div className="w-1/3"></div> {/* Spacer */}
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground w-1/3">
              {content.title}
            </h1>
            <div className="w-1/3 flex justify-end">
              <Button 
                onClick={toggleLanguage}
                variant="outline"
                className="text-sm font-semibold rounded-full"
              >
                {language === 'English' ? 'हिंदी में बदलें' : 'Switch to English'}
              </Button>
            </div>
          </div>

          <p className="text-md text-muted-foreground">
            {content.effectiveDateLabel}: {lastUpdated}
          </p> 
        </header>
        
        <Card className="shadow-lg p-6">
          <CardContent className="space-y-8 p-0">
            {currentSections.map((section, index) => (
              <div key={index}>
                <h2 className="font-serif text-xl font-semibold mb-3 text-primary">
                  {section.title}
                </h2>
                <div className="text-base text-foreground leading-relaxed">
                  {section.content}
                </div>
                {index < currentSections.length - 1 && <Separator className="mt-6 bg-accent/50" />}
              </div>
            ))}

            {/* Final Contact Information */}
            <div className="mt-10 pt-4 border-t border-muted-foreground/20">
              <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">
                {content.contactLabel}
              </h3>
              <p className="text-base text-foreground/80">
                {language === 'English' 
                  ? 'All legal notices, questions, or concerns regarding these Terms should be directed via email to:'
                  : 'इन शर्तों से संबंधित सभी कानूनी सूचनाएँ, प्रश्न या चिंताएँ ईमेल के माध्यम से'
                } 
                {' '}
                <a href={`mailto:${contactEmail}`} className="text-primary hover:underline font-medium">{contactEmail}</a>
                {' '}
                {language === 'Hindi' && 'पर भेजी जानी चाहिए।'}
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default TermsAndConditionsPage;