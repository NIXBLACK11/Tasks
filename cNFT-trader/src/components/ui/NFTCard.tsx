import React, { useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { NFTData } from '../../types';

interface NFTCardProps {
  nft: NFTData;
  onList?: (id: string, price: number) => void;
  onDelist?: (id: string) => void;
}

export const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const [showModal, setShowModal] = useState(false);
  const [price, setPrice] = useState('');

  return (
    <>
      <div className="bg-[#0A0A0A] rounded-lg overflow-hidden shadow hover:shadow-xl transition-shadow duration-300 border-cyan-400 border">
        <div className="relative w-full h-48">
          <img
            src={nft.image || "/api/placeholder/400/400"}
            alt={`NFT ${nft.id}`}
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="m-4">
          <div className="flex items-center justify-between mb-2 text-white">
            <h3 className="font-bold text-sm">NFT #{nft.id}</h3>
            <a
              href={nft.jsonUri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              <FaExternalLinkAlt size={16} className='text-[#512DA8]' />
            </a>
          </div>
          {nft.groupKey && (
            <p className="text-sm text-gray-600 mb-1">
              {nft.groupKey}: {nft.groupValue}
            </p>
          )}
        </div>

        <div className="bg-[#0A0A0A] px-4 py-3 border-t border-gray-100">
          <div className="mb-3">
            <p className="text-xs text-white">Owner</p>
            <p className="text-sm font-mono break-all text-white">{nft.owner}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
            >
              List
            </button>
            <button
            //  delist
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors text-sm"
            >
              Delist
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Set Listing Price</h3>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter max price"
              className="w-full px-3 py-2 border rounded mb-4"
              min="0"
              step="0.01"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // listNFT()
                }}
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setPrice('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};