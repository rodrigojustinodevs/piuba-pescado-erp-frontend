import { DetailInfoField, DetailSummaryCard } from './detailBlocks';
import { DetailInfoSection } from './DetailInfoSection';

export type DetailLabeledValue = { label: string; value: string };

export type EntityDetailMetricsBodyProps = {
  metricCards: DetailLabeledValue[];
  infoSectionTitle: string;
  infoItems: DetailLabeledValue[];
};

export function EntityDetailMetricsBody({
  metricCards,
  infoSectionTitle,
  infoItems,
}: Readonly<EntityDetailMetricsBodyProps>) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
        {metricCards.map((card) => (
          <DetailSummaryCard key={card.label} label={card.label} value={card.value} />
        ))}
      </div>
      <DetailInfoSection title={infoSectionTitle}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoItems.map((item) => (
            <DetailInfoField key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </DetailInfoSection>
    </>
  );
}
