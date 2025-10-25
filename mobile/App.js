import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, FlatList, Modal, SafeAreaView, StatusBar } from 'react-native';
import { API } from './lib/api';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [listings, setListings] = useState([]);
  const [viewingFee, setViewingFee] = useState(0);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const cats = await API.categories();
        const lst = await API.listings();
        setListings(lst.items || []);
        setViewingFee(lst.viewingFeeZMW || 0);
        const g = await API.groups();
        setGroups(g.items || []);
      } catch(e) {
        console.warn(e.message);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" />
      {/* Chilimba banner */}
      <View style={{ padding: 12, backgroundColor: '#f1f5f9', borderBottomWidth: 1, borderColor: '#e2e8f0' }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Chilimba (Village Banking)</Text>
        <Text style={{ marginTop: 4 }}>Save together, borrow fairly, and grow your group. Register early to set your rules.</Text>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <Pressable onPress={()=>setModalVisible(true)} style={{ backgroundColor: '#111827', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginRight: 8 }}>
            <Text style={{ color: '#fff' }}>What is Chilimba?</Text>
          </Pressable>
          <Pressable onPress={async ()=>{
            try{
              const g = await API.groups();
              alert(`Groups ready: ${g.items?.length||0}. Activation fee applies.`);
            }catch(e){ alert(e.message); }
          }} style={{ borderWidth: 1, borderColor: '#111827', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}>
            <Text>View Groups</Text>
          </Pressable>
        </View>
      </View>

      {/* Listings with viewing lock */}
      <FlatList
        data={listings}
        keyExtractor={(item)=>String(item.id)}
        renderItem={({ item }) => (
          <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#e5e7eb' }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
            <Text style={{ opacity: 0.7 }}>{item.location} • ZMW {item.priceZMW}</Text>
            <Text style={{ marginTop: 6 }}>
              {item.contactHidden ? `Contact locked. Unlock for ZMW ${viewingFee}.` : `Call: ${item.contact?.phone}`}
            </Text>
            {item.contactHidden && (
              <Pressable
                onPress={async ()=>{
                  try{
                    const r = await API.unlock(item.id);
                    alert('Contact unlocked (demo).');
                    // Refresh list
                    const lst = await API.listings();
                    setListings(lst.items || []);
                  }catch(e){ alert(e.message); }
                }}
                style={{ backgroundColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginTop: 8 }}
              >
                <Text style={{ color: '#fff' }}>Unlock Contact</Text>
              </Pressable>
            )}
          </View>
        )}
      />

      {/* Chilimba Info Modal */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={()=>setModalVisible(false)}>
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 8 }}>What is Chilimba?</Text>
          <Text>
            Chilimba is a rotating savings and credit association. Members contribute regularly and take turns receiving payouts.
            Use our app to register your WhatsApp group, set rules (contribution amount, payout order, penalties), and automate reminders.
          </Text>
          <View style={{ marginTop: 16 }}>
            <Pressable onPress={()=>setModalVisible(false)} style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}>
              <Text>Close</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
