import React from 'react';
import PropTypes from 'prop-types';

AlbumFrame.propTypes = {};

function AlbumFrame() {
    return (
        <>
            <div className="fixed left-0 top-0 z-10 h-full w-full content-center bg-gray-800 bg-opacity-50">
                <div className="relative z-20 m-auto h-[70%] w-[450px] cursor-default rounded-md border bg-black px-5 py-5 text-center font-kodchasan shadow-lg">
                    <div className="flex justify-between border-b border-slate-600 pb-3">
                        <h2 className="font-bold">Your playlist/album</h2>
                        <i class="bx bx-plus text-2xl"></i>
                    </div>
                    <div className="scrollbar-custom h-[90%] overflow-y-auto">
                        <div className="mt-2 flex rounded-md p-2 hover:bg-white hover:bg-opacity-25">
                            <img
                                className="h-20 w-20 rounded-md"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn-v5TirAbf_wnBn_6-ez3zx2bP2oPCz1MZQ&s"
                                alt=""
                            />
                            <div className="my-auto flex-col justify-between px-3 text-left">
                                <p className="text-xl font-bold">Đánh đổi</p>
                                <p className="text-sm">
                                    {'Playlist'}
                                    {' • '}
                                    {'43 songs'}
                                </p>
                            </div>
                        </div>
                        <div className="mt-2 flex rounded-md p-2 hover:bg-white hover:bg-opacity-25">
                            <img
                                className="h-20 w-20 rounded-md"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn-v5TirAbf_wnBn_6-ez3zx2bP2oPCz1MZQ&s"
                                alt=""
                            />
                            <div className="my-auto flex-col justify-between px-3 text-left">
                                <p className="text-xl font-bold">Đánh đổi</p>
                                <p className="text-sm">
                                    {'Playlist'}
                                    {' • '}
                                    {'43 songs'}
                                </p>
                            </div>
                        </div>
                        <div className="mt-2 flex rounded-md p-2 hover:bg-white hover:bg-opacity-25">
                            <img
                                className="h-20 w-20 rounded-md"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn-v5TirAbf_wnBn_6-ez3zx2bP2oPCz1MZQ&s"
                                alt=""
                            />
                            <div className="my-auto flex-col justify-between px-3 text-left">
                                <p className="text-xl font-bold">Đánh đổi</p>
                                <p className="text-sm">
                                    {'Playlist'}
                                    {' • '}
                                    {'43 songs'}
                                </p>
                            </div>
                        </div>
                        <div className="mt-2 flex rounded-md p-2 hover:bg-white hover:bg-opacity-25">
                            <img
                                className="h-20 w-20 rounded-md"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn-v5TirAbf_wnBn_6-ez3zx2bP2oPCz1MZQ&s"
                                alt=""
                            />
                            <div className="my-auto flex-col justify-between px-3 text-left">
                                <p className="text-xl font-bold">Đánh đổi</p>
                                <p className="text-sm">
                                    {'Playlist'}
                                    {' • '}
                                    {'43 songs'}
                                </p>
                            </div>
                        </div>
                        <div className="mt-2 flex rounded-md p-2 hover:bg-white hover:bg-opacity-25">
                            <img
                                className="h-20 w-20 rounded-md"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQn-v5TirAbf_wnBn_6-ez3zx2bP2oPCz1MZQ&s"
                                alt=""
                            />
                            <div className="my-auto flex-col justify-between px-3 text-left">
                                <p className="text-xl font-bold">Đánh đổi</p>
                                <p className="text-sm">
                                    {'Playlist'}
                                    {' • '}
                                    {'43 songs'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AlbumFrame;
