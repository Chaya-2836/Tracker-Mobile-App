import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';

type Props = {
  onSelect: (agencyName: string) => void;
};

type AgencyItem = string;

const AgencyList: React.FC<Props> = ({ onSelect }) => {
  const [agencies, setAgencies] = useState<AgencyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/filters/agencies')
      .then(res => setAgencies(res.data))
      .catch(err => console.error('❌ Failed to load agencies:', err))
      .finally(() => setLoading(false));
  }, []);

  const getLogoUrl = (agency: string) => {
    return `https://your-cdn.com/logos/${agency.toLowerCase()}.png`; // לדוגמה
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={agencies}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onSelect(item)}
          style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}
        >
          <Image
            source={{ uri: getLogoUrl(item) }}
            style={{ width: 40, height: 40, marginRight: 10, borderRadius: 20 }}
          />
          <Text style={{ fontSize: 16 }}>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default AgencyList;
