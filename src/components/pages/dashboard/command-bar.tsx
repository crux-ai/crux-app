'use client';

import { ArrowTopRightIcon, CrumpledPaperIcon, DashboardIcon, LightningBoltIcon, RadiobuttonIcon, RocketIcon, SliderIcon } from '@radix-ui/react-icons';
import { Command } from 'cmdk';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import CommandContextProvider from '@/context/command';
import { useCommand } from '@/context/use-command';
import { commands, demoCards, loadItems, OpenItems, showItems } from '@/lib/command/data';
import { handleSelect } from '@/lib/command/utils';
import { cn } from '@/lib/utils';

function ShowPage() {
  const { inputValue, setInputValue } = useCommand();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const commandPath = `${pathname}/content`;
  const commandString = 'show';
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <>
      <div cmd-input-wrapper="" className=" flex flex-row items-center justify-start">
        <SliderIcon className="mx-2 size-4  text-orange-500 dark:text-cyan-400" />
        <Badge variant="show"> @show </Badge>
        <Command.Input ref={inputRef} value={inputValue} onValueChange={setInputValue} className="w-full bg-transparent outline-none" placeholder="Pick a codebase to show..." />
      </div>
      <Command.List>
        <Command.Empty>Create a new project with load</Command.Empty>
        <Command.Group className="[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted-foreground">
          {showItems.map((item) => {
            const Icon = item.icon;
            return (
              <Command.Item
                key={item.title}
                className="flex cursor-pointer flex-row items-center justify-start rounded-lg p-3 data-[selected=true]:bg-primary-foreground"
                onSelect={() => handleSelect(router, commandPath, searchParams, commandString, item.title)}
              >

                <Icon className="mr-3 size-5" />
                <span className="w-20">{item.title}</span>
                <span className="ml-12 hidden text-muted-foreground lg:block">
                  {item.url}
                </span>
                <div className="grow"> </div>
                {(item.active
                  ? (
                      <LightningBoltIcon className="text-success" />
                    )
                  : (<LightningBoltIcon />)
                )}
              </Command.Item>
            );
          })}
        </Command.Group>
      </Command.List>
    </>
  );
}

function OpenPage() {
  const { inputValue, setInputValue } = useCommand();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const commandPath = `${pathname}/content`;
  const commandString = 'open';
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <>
      <div cmd-input-wrapper="" className=" flex flex-row items-center justify-start">
        <DashboardIcon className="mx-2 size-4  text-orange-500 dark:text-cyan-400" />
        <Badge variant="open"> @open </Badge>
        <Command.Input ref={inputRef} value={inputValue} onValueChange={setInputValue} className="w-full bg-transparent outline-none" placeholder="Pick a project..." />
      </div>
      <Command.List>
        <Command.Empty>Create a new project with load</Command.Empty>
        <Command.Group className="[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted-foreground">
          {OpenItems.map((item) => {
            const Icon = item.icon;
            return (
              <Command.Item
                key={item.title}
                className="flex cursor-pointer flex-row items-center justify-start rounded-lg p-3 data-[selected=true]:bg-primary-foreground"
                onSelect={() => handleSelect(router, commandPath, searchParams, commandString, item.title)}
              >

                <Icon className="mr-3 size-5" />
                <span className="w-20">{item.title}</span>
                <span className="ml-12 hidden text-muted-foreground lg:block">
                  {item.description}
                </span>
                <div className="grow"> </div>
                {(item.status
                  ? (
                      <RadiobuttonIcon className="size-5 text-success" />
                    )
                  : (<RadiobuttonIcon className="size-5 text-red-600" />)
                )}
              </Command.Item>
            );
          })}
        </Command.Group>
      </Command.List>
    </>
  );
}

function LoadPage() {
  const { inputValue, setInputValue } = useCommand();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const commandPath = `${pathname}/content`;
  const commandString = 'load';
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  return (
    <>
      <div cmd-input-wrapper="" className=" flex flex-row items-center justify-start">
        <RocketIcon className="mx-2 size-4  text-orange-500 dark:text-cyan-400" />
        <Badge variant="load"> @load </Badge>
        <Command.Input ref={inputRef} value={inputValue} onValueChange={setInputValue} className="w-full bg-transparent outline-none" placeholder="Enter github url..." />
      </div>
      <Command.List>
        <Command.Empty>Press Enter to load new url</Command.Empty>
        <Command.Group className="[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted-foreground">
          {loadItems.map((item) => {
            const Icon = item.icon;
            return (
              <Command.Item
                key={item.title}
                className="flex cursor-pointer flex-row items-center justify-start rounded-lg p-3 data-[selected=true]:bg-primary-foreground"
                onSelect={() => handleSelect(router, commandPath, searchParams, commandString, item.title)}
              >

                <Icon className="mr-3 size-5" />
                <span className="w-20">{item.title}</span>
                <span className="ml-12 hidden text-muted-foreground lg:block">
                  {item.url}
                </span>
                <div className="grow"> </div>
                {(item.active
                  ? (
                      <LightningBoltIcon className="text-success" />
                    )
                  : (<LightningBoltIcon />)
                )}
              </Command.Item>
            );
          })}
        </Command.Group>
      </Command.List>
    </>
  );
}

function BasePage() {
  const { pages, setPages, inputValue, setInputValue, isOpen, isExited } = useCommand();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Focus the input field when the component mounts
    if (inputRef.current && isExited) {
      inputRef.current.focus();
    }
  }, [isExited]);
  return (
    <>
      <div cmd-input-wrapper="" className=" flex flex-row items-center justify-start">
        <CrumpledPaperIcon className="mx-2 size-4  text-orange-500 dark:text-cyan-400" />
        <Command.Input ref={inputRef} value={inputValue} onValueChange={setInputValue} className="w-full bg-transparent outline-none" placeholder="Run commands here..." />
      </div>
      { isOpen && (
        <Command.List className="mt-2">
          <Command.Empty>No results found.</Command.Empty>

          <Command.Group className="[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted-foreground" heading="Commands">
            {commands.map((command) => {
              const Icon = command.icon;
              return (
                <Command.Item
                  key={command.text}
                  className="flex cursor-pointer flex-row items-center justify-start rounded-lg p-3 data-[selected=true]:bg-primary-foreground"
                  onSelect={() => {
                    setPages([...pages, command.page]);
                    setInputValue('');
                  }}
                >

                  <Icon className="mr-3 size-5" />
                  <span className="w-10">{command.text}</span>
                  <span className="ml-12 hidden text-muted-foreground lg:block">
                    {command.description}
                  </span>
                  <div className="grow"> </div>
                  <span className="mr-2 w-4 text-muted-foreground">
                    {' '}
                    {command.command}
                    {' '}
                  </span>
                </Command.Item>
              );
            })}
          </Command.Group>
        </Command.List>
      )}
    </>
  );
}

export function CommandMenu() {
  const [commandValue, setCommandValue] = useState('');
  const { pages, isOpen, setIsOpen, setPages, inputValue, setIsExited } = useCommand();
  const page = pages[pages.length - 1];

  const toggleList = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Command
      onKeyDown={(e) => {
      // Escape goes to previous page
      // Backspace goes to previous page when search is empty
        if (e.key === 'Escape' || (e.key === 'Backspace' && !inputValue)) {
          e.preventDefault();
          setPages(pages => pages.slice(0, -1));
          // TODO: If its the base page keep input field in focus
          setIsExited(true);
        }
      }}
      value={commandValue}
      onValueChange={setCommandValue}
      onFocus={toggleList}
      onBlur={toggleList}
      className="m-2 outline-none"
      label="Command Menu"
    >
      {!page && (
        <BasePage />
      )}
      {(page === 'load') && (
        <LoadPage />
      )}
      {(page === 'open') && (
        <OpenPage />
      )}
      {(page === 'show') && (
        <ShowPage />
      )}
    </Command>
  );
}

export function CommandBar() {
  return (
    <CommandContextProvider>
      <div className="group/bar relative  w-full sm:w-1/2">
        <div className="absolute -inset-1 animate-tilt rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 opacity-75 blur group-hover/bar:opacity-100 "></div>
        <div className="relative z-10 flex size-full flex-col rounded-t-lg border border-muted-foreground bg-background">
          <div className="flex w-full flex-row items-center justify-between">
            <h2 className="m-2 text-lg font-bold">
              Unlock your codebase
            </h2>
            <Badge variant="sparkle" className={cn('')}>
              NEW
            </Badge>
          </div>
          <hr className="h-px border-0 bg-muted-foreground" />
          <div className="flex h-full flex-col justify-center">
            <CommandMenu />
          </div>
          <hr className="flex h-px w-full border-0 bg-muted-foreground" />
          <div className="flex w-full flex-row items-center justify-start">
            {demoCards.map((values) => {
              const Icon = values.icon;
              return (
                <div key={values.text}>

                  <Badge variant="outline" className="group m-1 focus:scale-100 group-hover:scale-105" key={values.text}>
                    <Icon className="mr-1 size-3 group-hover:scale-110" />
                    {values.text}
                    <ArrowTopRightIcon className="ml-2 size-3 group-hover:translate-x-1 group-hover:scale-105" />
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CommandContextProvider>
  );
}
