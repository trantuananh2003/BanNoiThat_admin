import * as React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface CardIncomeAnalysistProps {
  revenueLastWeek: number;
  revenueCurrentWeek: number;
}

export default function CardIncomeAnalysist({
  revenueLastWeek,
  revenueCurrentWeek
}: CardIncomeAnalysistProps) {
  const diff = revenueCurrentWeek - revenueLastWeek;
  const percentChange =
    revenueLastWeek === 0 ? 100 : Math.round((diff / revenueLastWeek) * 100);
  const isIncrease = diff >= 0;

  return (
    <Card sx={{ minWidth: 275, boxShadow: 2, borderRadius: 3 }}>
      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left section */}
        <Box>
          <Typography sx={{ color: 'text.secondary', fontSize: 14 }} gutterBottom>
            Income
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {"$"} {revenueCurrentWeek}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography
              variant="body2"
              sx={{
                color: isIncrease ? 'green' : 'red',
                fontWeight: 'bold',
                mr: 1
              }}
            >
              {isIncrease ? '+' : '-'}
              {Math.abs(percentChange)}%
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {isIncrease ? 'Increase' : 'Decrease'} since last week
            </Typography>
          </Box>
        </Box>

        {/* Right icon circle */}
        <Avatar sx={{ bgcolor: '#f0f4ff', width: 40, height: 40 }}>
          <AttachMoneyIcon sx={{ color: '#5470ff' }} />
        </Avatar>
      </CardContent>
    </Card>
  );
}
