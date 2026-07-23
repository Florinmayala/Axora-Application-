import React from 'react';
import { BadgeCheck } from 'lucide-react';

export const VERIFIED_USERNAMES = new Set([
  'kaelen_afri_tech',
  'axora_social',
  'Lena_X',
  'lena_x',
  'invite_axo'
]);

export function isVerifiedAccount(username?: string) {
  return Boolean(username && VERIFIED_USERNAMES.has(username));
}

interface VerifiedBadgeProps {
  size?: number;
  className?: string;
}

export function VerifiedBadge({ size = 16, className = '' }: VerifiedBadgeProps) {
  return (
    <BadgeCheck
      width={size}
      height={size}
      className={`shrink-0 fill-[#0095F6] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.28)] ${className}`}
      strokeWidth={2.5}
      aria-label="Compte certifié"
    />
  );
}
