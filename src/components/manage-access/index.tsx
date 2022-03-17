import React, { useEffect, useState, useCallback } from 'react';
import {
    AuthUrlInfo,
    AuthUrls,
} from 'metadot-extension-base/background/handlers/State';
import { Header } from '../common';

import { Wrapper, VerticalContentDiv } from '../common/wrapper';
import SearchBar from '../common/search-bar';
import ManageAccessCard from './card';
import { getAuthList, toggleAuthorization } from '../../messaging';
import { fonts } from '../../utils';
import { SubHeading } from '../common/text';

const { subHeadingfontFamilyClass } = fonts;

function ManageAccess(): JSX.Element {
    const [search, setSearch] = useState('');
    const [authList, setAuthList] = useState<AuthUrls | null>(null);

    useEffect(() => {
        getAuthList()
            .then(({ list }) => setAuthList(list))
            .catch((e) => console.error(e));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearch(e.target.value);
    };

    const toggleAuth = useCallback((url: string) => {
        toggleAuthorization(url)
            .then(({ list }) => setAuthList(list))
            .catch(console.error);
    }, []);

    return (
        <Wrapper width="89%">
            <Header centerText="Manage Website Access" />

            <SearchBar
                id="search-bar"
                value={search}
                placeHolder="Search"
                onChange={handleChange}
            />

            <VerticalContentDiv style={{ marginTop: '30px' }}>
                {!authList || !Object.entries(authList)?.length ? (
                    <div
                        style={{
                            height: '420px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <SubHeading
                            color="#FAFAFA"
                            opacity="0.7"
                            fontSize="18px"
                            mb="135px"
                        >
                            No website request yet!
                        </SubHeading>
                    </div>
                ) : (
                    <div className="website-list">
                        {Object.entries(authList)
                            .filter(([url]: [string, AuthUrlInfo]) =>
                                url.includes(search)
                            )
                            .map(([url, info]: [string, AuthUrlInfo]) => (
                                <ManageAccessCard
                                    key={url}
                                    title={url}
                                    access={info.isAllowed}
                                    onClick={() => toggleAuth(url)}
                                />
                            ))}
                    </div>
                )}
            </VerticalContentDiv>
        </Wrapper>
    );
}

export default ManageAccess;
