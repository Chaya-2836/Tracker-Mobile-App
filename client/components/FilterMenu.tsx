import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Dimensions, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../app/styles/filterMenuStyle';
import { fetchAllFilters } from '@/app/Api/filters';

const screenWidth = Dimensions.get('window').width;

// ממפה תוויות UI לשמות פרמטרים ב-API
const filterKeys: { [label: string]: string } = {
  'Campaign': 'campaign_name',
  'Platform': 'platform',
  'Media Source': 'media_source',
  'Agency': 'agency',
  'Engagement Type': 'engagement_type',
};

type Props = {
  onApply: (selected: { [key: string]: string[] }) => void;  // callback לשליחת הבחירה
  onClear: () => void;                                       // callback לניקוי הפילטרים
};

export default function FilterMenu({ onApply, onClear }: Props) {
  // אפשרויות הפילטרים מהשרת
  const [filterOptions, setFilterOptions] = useState<{ [label: string]: string[] }>({});
  // הפילטרים שנבחרו ע"י המשתמש
  const [selected, setSelected] = useState<{ [label: string]: string[] }>({});
  // מצב פתיחה/סגירה של כל קבוצה
  const [expanded, setExpanded] = useState<{ [label: string]: boolean }>({});
  // האם תפריט הפילטרים נראה
  const [visible, setVisible] = useState(false);

  // אנימציית הזזה מצד ימין
  const slideAnim = useRef(new Animated.Value(screenWidth)).current;

  // בעת טעינת הקומפוננטה - טען את כל הפילטרים מהשרת
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const filters = await fetchAllFilters();
        setFilterOptions(filters);
      } catch (err) {
        console.log('Failed to load filter options', err);
      }
    };
    loadFilters();
  }, []);

  // פותח או סוגר את תפריט הסינון עם אנימציה
  const togglePanel = () => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: screenWidth,       // מחליק החוצה
        duration: 300,
        useNativeDriver: false,
      }).start(() => setVisible(false));
    } else {
      setVisible(true);
      Animated.timing(slideAnim, {
        toValue: screenWidth - 260, // מחליק פנימה (רוחב הפאנל)
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  // פותח או סוגר קבוצה מסוימת (למשל "Campaign")
  const toggleSection = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // בוחר או מבטל בחירה של אופציה מסוימת (בחירה יחידה לכל פילטר)
  const toggleOption = (label: string, option: string) => {
    setSelected(prev => {
      const current = prev[label];
      // אם האופציה נבחרה, מבטל בחירה, אחרת בוחר אותה
      const newSelection = current?.[0] === option ? [] : [option];

      const updated = { ...prev, [label]: newSelection };

      // ממיר את הבחירות לשמות פרמטרים של השרת
      const mappedSelection: { [key: string]: string[] } = {};
      Object.entries(updated).forEach(([label, val]) => {
        const param = filterKeys[label];
        if (param && val.length > 0) {
          mappedSelection[param] = val;
        }
      });

      onApply(mappedSelection); // מעדכן את הבחירה למעלה (למסך האב)
      return updated;
    });
  };

  // בודק אם אופציה מסוימת נבחרה, כדי לעצב אותה
  const isSelected = (label: string, option: string) =>
    selected[label]?.includes(option);

  return (
    <>
      {/* כפתור לפתיחת התפריט */}
      <TouchableOpacity onPress={togglePanel} style={styles.toggleButton}>
        <Ionicons name="menu" size={30} color="ff" />
      </TouchableOpacity>

      {/* תפריט הפילטרים המחליק */}
      {visible && (
        <Animated.View style={[styles.panel, { left: slideAnim }]}>
          <Text style={styles.title}>Filters</Text>

          <ScrollView>
            {/* הצגת כל קבוצות הפילטרים */}
            {Object.entries(filterOptions).map(([label, options]) => (
              <View key={label} style={styles.inputGroup}>
                {/* כותרת הקבוצה שנפתחת/נסגרת */}
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection(label)}

                  
                >
                  <Text style={styles.label}>{label}</Text>
                  <Ionicons
                    name={expanded[label] ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#2c3e50"
                  />
                </TouchableOpacity>

                {/* אפשרויות הקבוצה שמוצגות רק אם הקבוצה פתוחה */}
                {expanded[label] &&
                  options.map(option => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => toggleOption(label, option)}
                      style={[
                        styles.optionItem,
                        isSelected(label, option) && styles.optionItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          isSelected(label, option) && styles.optionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            ))}
          </ScrollView>

          {/* כפתור לניקוי כל הבחירות */}
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => {
              setSelected({});
              onClear();
            }}
          >
            <Text style={styles.btnText}>Clear Filters</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
}
