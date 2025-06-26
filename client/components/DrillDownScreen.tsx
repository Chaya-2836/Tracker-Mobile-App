import React, { useState } from 'react';
import { View } from 'react-native';
import AgencyList from '../components/AgencyList';

const DrillDownScreen = () => {
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <AgencyList onSelect={setSelectedAgency} />
      {/* בהמשך נציג כאן את ה-DrillDown עבור selectedAgency */}
    </View>
  );
};

export default DrillDownScreen;
