import { fireEvent, queryByAttribute, render, screen, waitFor } from '@testing-library/react';
import Dashboard from '@/components/dashboard/dashboard';
import { fetchCarbonIntensity } from '@/services/fetch-carbon-intensity';

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

jest.mock('@/services/fetch-carbon-intensity');

jest.mock('d3-time-format', () => ({
  timeFormat: jest.fn(() => () => 'Mocked Format'),
  utcFormat: jest.fn(() => () => 'Mocked UTC Format'),
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the loading state initially', () => {
    render(<Dashboard />);

    expect(screen.getByText('Loading chart data...')).toBeInTheDocument();
  });

  it('should render DateRangePicker component', () => {
    render(<Dashboard />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should fetch data and render chart when data is available', async () => {
    (fetchCarbonIntensity as jest.Mock).mockResolvedValue({
      data: [
        {
          from: '2024-10-07T00:00Z',
          intensity: { forecast: 100, actual: 95 },
        },
        {
          from: '2024-10-08T00:00Z',
          intensity: { forecast: 110, actual: 105 },
        },
      ],
    });
    const getById = queryByAttribute.bind(null, 'id');

    render(<Dashboard />);

    await waitFor(() => {
      expect(fetchCarbonIntensity).toHaveBeenCalledTimes(1);
    });

    const chartPortal = getById(document.body, 'react-charts-portal');
    expect(chartPortal).toBeInTheDocument();
  });

  it('should show "No data available" when the data is empty', async () => {
    (fetchCarbonIntensity as jest.Mock).mockResolvedValue(null);

    render(<Dashboard />);

    await waitFor(() => {
      expect(fetchCarbonIntensity).toHaveBeenCalledTimes(1); // Ensure API was called
    });

    await waitFor(() => {
      expect(screen.getByText('No data available.')).toBeInTheDocument();
      expect(screen.queryByText('Mocked Chart')).not.toBeInTheDocument();
    });
  });

  it('should show an error message when the API call fails', async () => {
    (fetchCarbonIntensity as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<Dashboard />);

    await waitFor(() => {
      expect(fetchCarbonIntensity).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText('Error fetching carbon intensity data')).toBeInTheDocument();
    });
  });

  it('should update the date range when DateRangePicker changes', async () => {
    (fetchCarbonIntensity as jest.Mock).mockResolvedValue({
      data: [
        {
          from: '2024-10-01T00:00:00Z',
          intensity: { forecast: 120, actual: 115 },
        },
        {
          from: '2024-10-07T00:00:00Z',
          intensity: { forecast: 110, actual: 105 },
        },
      ],
    });

    const { getByRole, getByText } = render(<Dashboard />);

    const input = getByRole('textbox');
    fireEvent.focus(input);

    const newStartDate = getByText('1');
    const newEndDate = getByText('7');

    fireEvent.click(newStartDate);
    fireEvent.click(newEndDate);

    await waitFor(() => {
      expect(fetchCarbonIntensity).toHaveBeenCalledTimes(2); // 1 for the initial call, 1 for the date change
    });
  });
});
