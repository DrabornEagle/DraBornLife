import { useEffect, useState } from 'react';
import { loadLifeData, resetLifeData, saveLifeData } from '../storage/lifeStorage';

export function useLifeData() {
  const [lifeData, setLifeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    loadLifeData()
      .then((data) => {
        if (isMounted) {
          setLifeData(data);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function updateLifeData(nextData) {
    const saved = await saveLifeData(nextData);
    setLifeData(saved);
    return saved;
  }

  async function resetLocalData() {
    const resetData = await resetLifeData();
    setLifeData(resetData);
    return resetData;
  }

  return {
    lifeData,
    isLoading,
    updateLifeData,
    resetLocalData,
  };
}
