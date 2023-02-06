import React, { useState, useEffect, useMemo } from 'react';
import { ProductItem } from './types';
import {
  Container,
  Input,
  InputGroup,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
} from 'reactstrap';
import Loading from './components/Loading';
import { LIMIT, API_URL } from './constant';
import moment from 'moment';
import './App.scss';

interface SearchFilter {
  searchValue: string;
  isArchived: boolean;
  afterDate: Date | null;
}

function App() {
  const [isFilterOpen, setFilterOpen] = useState<boolean>(false);
  const [data, setData] = useState<Array<ProductItem>>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [currentFilter, setCurrentFilter] = useState<SearchFilter>({
    searchValue: '',
    isArchived: false,
    afterDate: null,
  });

  const currentData = useMemo<Array<ProductItem>>(() => {
    let newData = [...data];
    if (sortBy === 'latest') {
      newData.sort(
        (a: ProductItem, b: ProductItem) =>
          new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
      );
    } else if (sortBy === 'oldest') {
      newData.sort(
        (a: ProductItem, b: ProductItem) =>
          new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime()
      );
    }
    newData = newData.filter((d: ProductItem) => !d.archived);
    return newData;
  }, [data, sortBy]);

  const filteredData = useMemo(() => {
    let newData = [...currentData];
    console.log('filtered data', { currentFilter });
    if (currentFilter.searchValue !== '') {
      const searchValue: string = currentFilter.searchValue;
      newData = newData.filter(
        (item: ProductItem) => item.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
      );
      console.log('newData', { currentFilter, newData });
    }

    return newData;
  }, [currentFilter, currentData]);

  const displayedData = useMemo<Array<ProductItem>>(() => {
    const first = (page - 1) * LIMIT;
    const last = page * LIMIT;
    return filteredData.slice(first, last);
  }, [page, filteredData]);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setLoading(true);
    fetch(`${API_URL}/product`)
      .then((res: Response) => res.json())
      .then((data: Array<ProductItem>) => {
        setData(data);
        setPage(1);
      })
      .catch(() => {
        console.log('An error occured');
      })
      .finally(() => setTimeout(() => setLoading(false), 500));
  }

  function renderStatus(status: string) {
    if (status === 'INCOMPLETE') {
      return <span className="text-danger">Incomplete</span>;
    } else if (status === 'SHOOTING') {
      return <span className="text-primary">Shooting on progress</span>;
    } else if (status === 'EDITING') {
      return <span className="text-secondary">Video Editing</span>;
    } else if (status === 'FEEDBACK') {
      return <span className="text-primary">Waiting for feedback</span>;
    } else if (status === 'COMPLETED') {
      return <span className="text-success">Complete</span>;
    }
    return null;
  }

  function startLoading(callback: () => void) {
    setLoading(true);
    setTimeout(() => {
      callback();
      setLoading(false);
    }, 500);
  }

  function changePage(page: number) {
    startLoading(() => {
      setPage(page);
    });
  }

  function setCurrentSort(sort: string) {
    console.log({ sort });
    startLoading(() => {
      setSortBy(sort);
      setPage(1);
    });
  }

  function applyFilter() {
    startLoading(() => {
      setCurrentFilter({
        ...currentFilter,
        searchValue,
      });
    });
  }

  function renderContent() {
    return (
      <div className="d-flex flex-column">
        <div className="table-component mt-3">
          <div className="table-heading">
            <div className="table-data">No.</div>
            <div className="table-data">Name</div>
            <div className="table-data">Type</div>
            <div className="table-data">Status</div>
            <div className="table-data">Created</div>
            <div className="table-data">Manage</div>
          </div>
          {displayedData.map((item: ProductItem, index: number) => (
            <div key={item.id} className="table-row">
              <div className="table-data">{(page - 1) * LIMIT + index + 1}</div>
              <div className="table-data">{item.name}</div>
              <div className="table-data">{item.type}</div>
              <div className="table-data">{renderStatus(item.status)}</div>
              <div className="table-data">{moment(item.createdOn).format('MMM DD, YYYY')}</div>
              <div className="table-data">|</div>
            </div>
          ))}
          <div className="d-flex flex-row justify-content-center">
            <Pagination>
              <PaginationItem>
                <PaginationLink onClick={() => (page > 1 ? changePage(page - 1) : {})}>
                  Prev
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() =>
                    page < Math.floor(data.length / LIMIT) ? changePage(page + 1) : {}
                  }
                >
                  Next
                </PaginationLink>
              </PaginationItem>
            </Pagination>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Container className="my-5">
      <h3>Hello Hitsam</h3>
      <span>Here is the list of your video</span>
      <Container className="mt-4 video-main-container">
        <div className="d-flex flex-row">
          <InputGroup>
            <ButtonDropdown isOpen={isFilterOpen} toggle={() => setFilterOpen(!isFilterOpen)}>
              <DropdownToggle caret>Filter</DropdownToggle>
              <DropdownMenu>
                <DropdownItem>Filter by type</DropdownItem>
                <DropdownItem>Filter is archived</DropdownItem>
                <DropdownItem>Filter by excluding type</DropdownItem>
                <DropdownItem>Filter is not archived</DropdownItem>
                <DropdownItem>Filter after certain date</DropdownItem>
              </DropdownMenu>
            </ButtonDropdown>
            <Input
              value={searchValue}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  applyFilter();
                }
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
              placeholder="Search project..."
            />
            <Button onClick={applyFilter}>Apply Filter</Button>
          </InputGroup>
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentSort(e.target.value)}
            className="sort-selection ms-3"
            type="select"
          >
            <option value="none">Sort by</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </Input>
        </div>
        {isLoading ? <Loading /> : renderContent()}
      </Container>
    </Container>
  );
}

export default App;
