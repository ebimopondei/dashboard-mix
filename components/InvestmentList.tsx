
import React from 'react';
import { Investment } from '../types';
import { InvestmentCard } from './InvestmentCard';

interface InvestmentListProps {
  investments: Investment[];
  onInvestmentClick?: (id: string) => void;
}

export const InvestmentList: React.FC<InvestmentListProps> = ({ investments, onInvestmentClick }) => {
  return (
    <section className="flex flex-col gap-4 pb-4">
      {investments.map((investment) => (
        <InvestmentCard 
          key={investment.id} 
          investment={investment} 
          onClick={onInvestmentClick ? () => onInvestmentClick(investment.id) : undefined}
        />
      ))}
    </section>
  );
};
