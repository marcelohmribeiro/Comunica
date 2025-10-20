import { useMemo, useRef, useState, useCallback } from "react";
import { View, Text, FlatList, RefreshControl } from "react-native";
import { Divider } from "@/components/ui";
import {
  ReportCard,
  ReportDetail,
  ReportStatus,
  LoadingDots,
} from "@/components";
import { useReports } from "@/store";
import { CategorySelect } from "@/components/_category-select";

const Reports = () => {
  const { items, fetch, hasMore } = useReports();

  const [refreshing, setRefreshing] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isPaging, setIsPaging] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(null);

  const pagingRef = useRef(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetch({ limit: 10, reset: true });
    } finally {
      setRefreshing(false);
    }
  }, [fetch]);

  // paginação
  const onEndReached = useCallback(async () => {
    if (pagingRef.current) return;
    if (!hasMore) return;
    pagingRef.current = true;
    setIsPaging(true);
    try {
      await fetch({ limit: 10 });
    } finally {
      pagingRef.current = false;
      setIsPaging(false);
    }
  }, [fetch, hasMore]);

  const filteredItems = useMemo(() => {
    return items.filter((it) =>
      categoryFilter ? it.category === categoryFilter : true
    );
  }, [items, categoryFilter]);

  const count = useMemo(() => items.length, [items]);

  const renderItem = ({ item }) => {
    return (
      <View className="mx-4 mt-4 rounded-2xl bg-white border border-gray-200">
        <View className="p-3">
          <ReportCard
            report={item}
            onPress={() => {
              setSelected(item);
              setOpenDetail(true);
            }}
          />
        </View>
        <Divider />
        <ReportStatus status={item.status} />
      </View>
    );
  };

  const ListFooter = useMemo(
    () =>
      isPaging ? (
        <View className="py-4 items-center">
          <LoadingDots className="text-xs text-gray-500" />
        </View>
      ) : null,
    [isPaging]
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white border-b border-gray-200 px-4 pt-4 pb-3">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-gray-800">
            Todos os reports
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">
            {count} resultados
          </Text>
        </View>

        <View className="mt-3">
          <CategorySelect
            value={categoryFilter}
            onChange={(val) => setCategoryFilter(val)}
            label="Filtrar por categoria"
          />
        </View>

        {categoryFilter && (
          <Text
            onPress={() => setCategoryFilter(null)}
            className="text-xs text-blue-600 font-semibold mt-1"
          >
            Limpar filtro
          </Text>
        )}
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListFooterComponent={ListFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-16">
            <Text className="text-sm text-gray-500">
              Nenhuma denúncia encontrada.
            </Text>
          </View>
        }
      />

      {openDetail && selected && (
        <ReportDetail
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          report={selected}
        />
      )}
    </View>
  );
};

export default Reports;
