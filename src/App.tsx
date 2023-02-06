import React, { useState, useEffect } from 'react';
import { ProductItem, ProductStatus } from './types';
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

interface ProductItemSearch {
  name: string;
  archived: boolean;
  sortBy?: string;
  status?: string;
  page: number;
  limit: number;
  querySearch?: string;
  not?: ProductItemSearch;
}

function App() {
  const [isFilterOpen, setFilterOpen] = useState<boolean>(false);
  const [data, setData] = useState<Array<ProductItem>>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [currentParam, setCurrentParam] = useState<ProductItemSearch>({
    name: '',
    archived: false,
    limit: LIMIT,
    page: 1,
  });

  useEffect(() => {
    loadData(convertObjectToParam());
  }, [currentParam]);

  function convertObjectToParam() {
    let result = '';
    result += `archived=${currentParam.archived}&`;
    result += `_limit=${currentParam.limit}&`;
    result += `_page=${currentParam.page}`;
    if (currentParam.sortBy) {
      result += `&_sort=createdOn&_order=${currentParam.sortBy}`;
    }
    if (currentParam.name) {
      result += `&name_like=${currentParam.name}`;
    }
    if (currentParam.querySearch) {
      result += `&q=${currentParam.querySearch}`;
    }
    if (currentParam.status) {
      result += `&status=${currentParam.status}`;
    }
    if (currentParam.not) {
      if (currentParam.not.status) {
        result += `&status_ne=${currentParam.not.status}`;
      }
      if (currentParam.not.querySearch) {
        result += `&type_ne=${currentParam.not.querySearch}`;
      }
    }

    return result;
  }

  function loadData(param: string) {
    setLoading(true);
    fetch(`${API_URL}/product?${param}`)
      .then((res: Response) => res.json())
      .then((data: Array<ProductItem>) => {
        setData(data);
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

  function implementFilterTextBox(filterText: string) {
    setSearchValue(searchValue + filterText + ' ');
  }

  function changePage(pageParam: number, flag: boolean) {
    if ((!flag && pageParam < 1) || (flag && data.length === 0)) {
      return;
    }
    setCurrentParam({
      ...currentParam,
      page: pageParam,
    });
    setTimeout(() => setPage(pageParam), 10);
  }

  function setCurrentSort(sort: string) {
    console.log({ sort });
    const newParam = { ...currentParam };
    if (sort === 'latest') {
      newParam.sortBy = 'desc';
    } else if (sort === 'oldest') {
      newParam.sortBy = 'asc';
    } else {
      newParam.sortBy = '';
    }
    setCurrentParam(newParam);
    setPage(1);
  }

  function applyFilter() {
    const regIs = /is:(\w+)/g;
    const regNot = /not:(\w+)/g;
    const checkValues = searchValue.match(regIs);
    const checkNotValues = searchValue.match(regNot);
    const newParam: ProductItemSearch = {
      name: '',
      archived: false,
      limit: LIMIT,
      page: 1,
    };
    console.log({ checkValues, checkNotValues });
    if (checkValues) {
      checkValues.forEach((item: string) => {
        const val = item.replace('is:', '');
        if (val === 'archived') {
          newParam.archived = true;
        } else if (val.toUpperCase() in ProductStatus) {
          newParam.status = val.toUpperCase();
        } else {
          newParam.querySearch = val;
        }
      });
    }
    if (checkNotValues) {
      const notParam: ProductItemSearch = {
        name: '',
        archived: false,
        limit: LIMIT,
        page: 1,
      };
      checkNotValues.forEach((item: string) => {
        const val = item.replace('not:', '');
        if (val === 'archived') {
          newParam.archived = false;
        } else if (val.toUpperCase() in ProductStatus) {
          notParam.status = val.toUpperCase();
        } else {
          notParam.querySearch = val;
        }
      });
      newParam.not = notParam;
    }

    if (!checkValues && !checkNotValues) {
      newParam.name = searchValue;
    }
    setCurrentParam(newParam);
    setPage(1);
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
          {data.map((item: ProductItem, index: number) => (
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
                <PaginationLink onClick={() => changePage(page - 1, false)}>Prev</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => changePage(page + 1, true)}>Next</PaginationLink>
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
                <DropdownItem onClick={() => implementFilterTextBox('is:<ANY_TYPE>')}>
                  Filter by type
                </DropdownItem>
                <DropdownItem onClick={() => implementFilterTextBox('is:<ANY_TYPE>')}>
                  Filter is archived
                </DropdownItem>
                <DropdownItem onClick={() => implementFilterTextBox('is:not:<ANY_TYPE>')}>
                  Filter by excluding type
                </DropdownItem>
                <DropdownItem onClick={() => implementFilterTextBox('not:archived')}>
                  Filter is not archived
                </DropdownItem>
                <DropdownItem onClick={() => implementFilterTextBox('after:<DATE>')}>
                  Filter after certain date
                </DropdownItem>
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
