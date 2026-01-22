import './styles.scss';
import { Dispatch, SetStateAction } from 'react';
import { normalize } from '@/app/utils/string';

interface Props {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  items: string[];
  label: string;
  handleSelectValue: (cityName: string) => void;
}

export default function PixelArtDropdown({
  value,
  setValue,
  items,
  label,
  handleSelectValue,
}: Props) {
  return (
    <div className="weather-form-dropdown">
      <div className="weather-form-dropdown__main">
        {label && <label>{label}</label>}
        <input
          id="location"
          name="location"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="weather-form-dropdown__list" id="location-choices">
        {items
          .filter((filteredValue) => normalize(filteredValue).includes(normalize(value)))
          .map((mappedValue) => {
            return (
              <p
                onMouseDown={() => {
                  handleSelectValue(mappedValue);
                }}
                key={mappedValue}
              >
                {mappedValue}
              </p>
            );
          })}
      </div>
    </div>
  );
}
